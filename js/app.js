import { loadPage } from "./loadPage.js";
import { initBackgroundGraph } from './modules/background.js'; 


function updateActiveLink(pagePath) {
    const currentActive = document.querySelector('header .nav__link--active');
    if (currentActive) {
        currentActive.classList.remove('nav__link--active');
    }
    
    const newActiveLink = document.querySelector(`header .nav__link[data-page-path="${pagePath}"]`);
    if (newActiveLink) {
        newActiveLink.classList.add('nav__link--active');
    }
}


function handleNavigationClick(event) {
    const link = event.target.closest('a[data-page-path]');
    if (link) {
        event.preventDefault();
        const pagePath = link.dataset.pagePath;
        if (pagePath) {
            loadPage(pagePath);
            updateActiveLink(pagePath); 
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', handleNavigationClick); 
    loadPage('html/home.html');
    updateActiveLink('html/home.html'); 
    initBackgroundGraph();
});