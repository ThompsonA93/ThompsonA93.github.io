let currentPage  = 1;
const reposPerPage  = 5;
let allRepositories  = [];

async function displayGithubRepositories() {
    try {
        const response = await fetch('https://api.github.com/users/ThompsonA93/repos');
        if (!response.ok) {
            throw new Error('Error fetching data from api.github.com');
        }
        const repositories = await response.json();

        allRepositories  = repositories.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            pushed_at: new Date(repo.pushed_at),
            language: repo.language,
            topics: repo.topics,
            stargazers_count: repo.stargazers_count,
            archived: repo.archived
        })).sort((a, b) => b.pushed_at - a.pushed_at);

        // Filter unwanted
        allRepositories = allRepositories.filter(repo => {
            return repo.name !== 'ThompsonA93' && repo.name !== 'ThompsonA93.github.io';
        });

        // Add category for individual styles
        allRepositories = allRepositories.filter(repo => {
            
        })


        renderRepositories(allRepositories, currentPage, reposPerPage);
        setupPaginationControls();

    } catch (error) {
        console.error("Error fetching repositories:", error);
        const reposContainer = document.getElementById('repos');
        reposContainer.innerHTML = '<p>Failed to load repositories. Please try again later.</p>';
    }
}


function renderRepositories(repos, page, perPage) {
    const repoContainer = document.getElementById('github-repositories');
    repoContainer.innerHTML = '';

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const paginatedRepos = repos.slice(startIndex, endIndex);

    if (paginatedRepos.length === 0) {
        repoContainer.innerHTML = '<p>No repositories to display.</p>';
        return;
    }

    paginatedRepos.forEach(repository => {
        const repoElement = document.createElement('div');
        let isArchive = repository.archived ? '(Archived)' : '';
        let latestUpdate = repository.pushed_at.toLocaleDateString();
        
        repoElement.innerHTML = `
            <h3>
                <a href="${repository.url}" target="_blank">${repository.name} ${isArchive}</a>
                <span style="float: right;"><strong>Latest:</strong> ${latestUpdate}</span>
            </h3>
            <p>${repository.description || 'No description available'}</p>
            <div class="repo-details">
                <span><strong>Language:</strong> ${repository.language || 'N/A'}</span>
                <span><strong>Stars:</strong> ${repository.stargazers_count}</span>
            </div>
        `;
        repoContainer.appendChild(repoElement);
    });
}

function setupPaginationControls() {
    const totalPages = Math.ceil(allRepositories.length / reposPerPage);
    const paginationContainer = document.getElementById('pagination-controls');

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        renderRepositories(allRepositories, currentPage, reposPerPage);
        setupPaginationControls(); 
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active'); 
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderRepositories(allRepositories, currentPage, reposPerPage);
            setupPaginationControls();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        renderRepositories(allRepositories, currentPage, reposPerPage);
        setupPaginationControls();
    });
    paginationContainer.appendChild(nextButton);
}