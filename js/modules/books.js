const booksState = {
    isbn_data: [],
    book_data: []
}

export async function displayBookData() {
    if (booksState.isbn_data.length === 0) {
        await fetchISBNData();
    }
    if (booksState.book_data.length === 0) {
        await fetchBookData();
    }
    renderBooks();
}



async function fetchISBNData() {
    try {
        const response = await fetch('/json/books.json');
        if (!response.ok) {
            throw new Error('Could not load ISBN list.');
        }
        booksState.isbn_data = await response.json();
    } catch (error) {
        throw new Error('Could not load ISBN list')
    }
}



async function fetchBookData() {
    const promises = booksState.isbn_data.map(localBook => {
        return fetchBookByISBN(localBook.isbn);
    });

    try {
        const allBookData = await Promise.allSettled(promises);
        allBookData.forEach((apiBookData, index) => {
            if (apiBookData.status === 'fulfilled' && apiBookData.value) {
                const localBook = booksState.isbn_data[index];
                const combinedBookData = {
                    ...apiBookData.value,
                    notes: localBook.notes
                };
                booksState.book_data.push(combinedBookData);
            }
        });

    } catch (error) {
        console.error("One or more book fetches failed:", error);
    }
}




async function fetchBookByISBN(isbn) {
    const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const isbnKey = `ISBN:${isbn}`; 
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`Error fetching data for ISBN ${isbn}: ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();
        if (data && data[isbnKey]) {
            const bookData = data[isbnKey];

            const mappedData = {
                title: bookData.title,
                authors: bookData.authors ? bookData.authors.map(author => author.name) : ['N/A'],
                imageLinks: {
                    thumbnail: bookData.cover ? bookData.cover.medium : null 
                },
                url: bookData.url ? bookData.url : null,
                notes: '' 
            };
            
            return mappedData;
        } else {
            console.warn(`Book not found for ISBN: ${isbn}`);
            return null;
        }
    } catch (error) {
        console.error(`Failed to fetch book data for ISBN ${isbn}:`, error);
        return null;
    }
}



async function renderBooks() {
    const booksContainer = document.getElementById('book-data');
    booksContainer.innerHTML = ''; 

    booksState.book_data.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('books__item'); 

        const authorNames = book.authors ? book.authors.join(', ') : 'Unknown Author';
        const imageUrl = book.imageLinks?.thumbnail || 'placeholder.png'; 
        
        bookElement.innerHTML = `
        <div class="books__item-text">
            <h3 class="books__item-header"><a href="${book.url}">${book.title || 'Untitled'}</a></h3>
            <p class="books__item-author">Author: ${authorNames}</p>
            <p class="books__item-notes">${book.notes}</p>
        </div>
        <img class="books_item-image" src="${imageUrl}" alt="${book.title} Cover">
        `;
        booksContainer.appendChild(bookElement);
    });
}
