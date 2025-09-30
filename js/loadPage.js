import { displayBookData } from "./modules/books.js";
import { displayFitnessData } from "./modules/fitness.js";
import { displayGithubRepositories } from "./modules/github.js";
import { displayJourneyMap } from "./modules/journeys.js";

const componentMap = {
    'github-data': displayGithubRepositories,
    'fitness-data': displayFitnessData,
    'book-data': displayBookData,
    'map-data': displayJourneyMap
};

export function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            for (const containerId in componentMap) {
                if (document.getElementById(containerId)) {
                    componentMap[containerId]();
                }
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
            document.getElementById('content').innerHTML = '<p>Error loading page. Please try again later.</p>';
        });
}