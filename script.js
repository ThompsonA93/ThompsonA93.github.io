function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            if (document.getElementById('repos')) {
                displayPinnedRepos();
            }
            applyLanguage();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            document.getElementById('content').innerHTML = '<p>Error loading page. Please try again later.</p>';
        });


}

window.onload = () => {
    loadPage('src/about.html');
    applyLanguage();
    updateNavbarText(document.documentElement.getAttribute('lang'));
};

function toggleMode() {
    const body = document.body;
    const button = document.getElementById('toggle-mode');
    body.classList.toggle('dark-mode');
    button.textContent = body.classList.contains('dark-mode') ? '🌜' : '🌞';
}

function toggleLanguage() {
    const button = document.getElementById('toggle-language');
    const currentLanguage = document.documentElement.getAttribute('lang');
    const newLanguage = currentLanguage === 'en' ? 'de' : 'en';

    button.textContent = newLanguage === 'de' ? '🇩🇪' : '🇬🇧';
    document.documentElement.setAttribute('lang', newLanguage);

    applyLanguage();
    updateNavbarText(newLanguage);
}

function applyLanguage() {
    const lang = document.documentElement.getAttribute('lang');
    document.querySelectorAll('[lang]').forEach(element => {
        element.style.display = element.getAttribute('lang') === lang ? 'block' : 'none';
    });
}

function updateNavbarText(language) {
    const navbarItems = {
        en: ['About me', 'Projects', 'Contact'],
        de: ['Über mich', 'Projekte', 'Kontakt']
    };

    const navLinks = document.querySelectorAll('.navbar ul li a');
    navLinks.forEach((link, index) => {
        link.textContent = navbarItems[language][index];
    });
}


async function displayPinnedRepos() {
    try {
        const response = await fetch('https://api.github.com/users/ThompsonA93/repos');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const repos = await response.json();
        
        const repoDetails = repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            pushed_at: new Date(repo.pushed_at),
            language: repo.language,
            stargazers_count: repo.stargazers_count
        }));

        repoDetails.sort((a, b) => b.pushed_at - a.pushed_at);

        const reposContainer = document.getElementById('repos');
        reposContainer.innerHTML = '';

        repoDetails.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.innerHTML = `
                <h3>
                    <a href="${repo.url}" target="_blank">${repo.name}</a>
                    <span style="float: right;"><strong>Latest:</strong> ${repo.pushed_at.toLocaleDateString()}</span>
                </h3>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-details">
                    <span><strong>Language:</strong> ${repo.language || 'N/A'}</span>
                    <span><strong>Stars:</strong> ${repo.stargazers_count}</span>
                </div>
            `;
            reposContainer.appendChild(repoElement);
        });

    } catch (error) {
        console.error('Error fetching repositories:', error);
        const reposContainer = document.getElementById('repos');
        reposContainer.innerHTML = '<p>Failed to load repositories. Please try again later.</p>';
    }
}