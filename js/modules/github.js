const repositoryData = {
    allRepositories: [],
    currentPage: 1,
    reposPerPage: 5,
};

const repoContainer = document.getElementById('github-repositories');
const paginationContainer = document.getElementById('pagination-controls');

export async function displayGithubRepositories() {
    if(repositoryData.allRepositories.length === 0){
        await fetchGithubData();
    }

    renderRepositories();
    setupPaginationControls();
}

async function fetchGithubData() {
    try {
        const response = await fetch('https://api.github.com/users/ThompsonA93/repos');
        if (!response.ok) {
            throw new Error('Error fetching data from api.github.com');
        }
        const repositories = await response.json();

        repositoryData.allRepositories = repositories
            .filter(repo => {
                return repo.name !== 'ThompsonA93' && repo.name !== 'ThompsonA93.github.io';
            })
            .map(repo => {
                let category = "project";

                // TODO :: Add some more categories later, maybe.
                if (repo.name.toLowerCase().includes('codelab')) {
                    category = 'education';
                }

                return {
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                    pushed_at: new Date(repo.pushed_at),
                    language: repo.language,
                    topics: repo.topics,
                    stargazers_count: repo.stargazers_count,
                    archived: repo.archived,
                    category: category
                };

            }).sort((a, b) => b.pushed_at - a.pushed_at)

    } catch (error) {
        console.error("Error fetching repositories:", error);
        repoContainer.innerHTML = '<p>Failed to load repositories. Please try again later.</p>';
    }
}

function renderRepositories() {
    const repoContainer = document.getElementById('github-repositories');
    repoContainer.innerHTML = '';

    const startIndex = (repositoryData.currentPage - 1) * repositoryData.reposPerPage;
    const endIndex = startIndex + repositoryData.reposPerPage;
    const paginatedRepos = repositoryData.allRepositories.slice(startIndex, endIndex);

    if (paginatedRepos.length === 0) {
        repoContainer.innerHTML = '<p>No repositories to display.</p>';
        return;
    }

    paginatedRepos.forEach(repository => {
        const repoComponent = createRepoComponent(repository);
        repoContainer.appendChild(repoComponent);
    });
};


function createRepoComponent(repository) {
    const isArchive = repository.archived ? '(Archived)' : '';
    const latestUpdate = repository.pushed_at.toLocaleDateString();

    const repoElement = document.createElement('div');
    repoElement.classList.add('repository-item'); 
    const repoHTML = `
            <h3 class=${repository.category}>
                <a href="${repository.url}" target="_blank">${repository.name} ${isArchive}</a>
                <span style="float: right;"><strong>Latest:</strong> ${latestUpdate}</span>
            </h3>
            <p>${repository.description || 'No description available'}</p>
            <div class="repo-details">
                <span><strong>Language:</strong> ${repository.language || 'N/A'}</span>
                <span><strong>Topics:</strong> ${repository.topics || 'N/A'}</span>
                <span><strong>Stars:</strong> ${repository.stargazers_count}</span>
            </div>
        `;

    repoElement.innerHTML = repoHTML;
    return repoElement;
};



function setupPaginationControls() {
    const totalPages = Math.ceil(repositoryData.allRepositories.length / repositoryData.reposPerPage);
    const paginationContainer = document.getElementById('pagination-controls');

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = repositoryData.currentPage === 1;
    prevButton.addEventListener('click', () => {
        repositoryData.currentPage--;
        renderRepositories();
        setupPaginationControls();
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === repositoryData.currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            repositoryData.currentPage = i;
            renderRepositories();
            setupPaginationControls();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = repositoryData.currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        repositoryData.currentPage++;
        renderRepositories();
        setupPaginationControls();
    });
    paginationContainer.appendChild(nextButton);
}