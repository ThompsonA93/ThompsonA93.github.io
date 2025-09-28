import { loadPage } from "./loadPage.js";
import { initBackgroundGraph } from './modules/background.js'; 

function updateActiveLink(newActiveLink) {
    const currentActive = document.querySelector('.nav__link--active');
    if (currentActive) {
        currentActive.classList.remove('nav__link--active');
    }
    newActiveLink.classList.add('nav__link--active');
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            updateActiveLink(link);
            
            const pagePath = link.dataset.pagePath;
            if (pagePath) {
                loadPage(pagePath);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadPage('html/hobbies.html');
    initBackgroundGraph();
})