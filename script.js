function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            applyLanguage();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            document.getElementById('content').innerHTML = '<p>Error loading page. Please try again later.</p>';
        });
}

// Load the default page (about.html) on initial load
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
        en: ['About me', 'Services', 'Projects', 'Contact'],
        de: ['Über mich', 'Angebote', 'Projekte', 'Kontakt']
    };

    const navLinks = document.querySelectorAll('.navbar ul li a');
    navLinks.forEach((link, index) => {
        link.textContent = navbarItems[language][index];
    });
}