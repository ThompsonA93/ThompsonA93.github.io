const journeyData = {
    journeys: [],
}

let map = null;

const mapContainer = document.getElementById('map-data')

export async function displayJourneyMap() {
    if (journeyData.journeys.length === 0) {
        await fetchJourneyData();
    }
    renderMap();
    addJourneyMarkers();
}


async function fetchJourneyData() {
    try {
        const response = await fetch('/json/journeys.json');
        if (!response.ok) {
            throw new Error('Could not load data.')
        }
        journeyData.journeys = await response.json();
    } catch (error) {
        console.error('Error fetching fitness data:', error);
        if (mapContainer) {
            mapContainer.innerHTML = `<p>Failed to load map. Try again later</p>`
        }
        return null;
    }
}

function renderMap() {

    if (map) {
        map.remove();
    }

    map = L.map('map-data').setView([20, 0], 2); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

}

function addJourneyMarkers() {
    if (!map || journeyData.journeys.length === 0) {
        console.warn("Map not initialized or no journey data available.");
        return;
    }

    journeyData.journeys.forEach(journey => {
        const [lat, lng] = journey.location; 

        const marker = L.marker([lat, lng]);

        const popupContent = `
            <div>
                <h4>${journey.name}</h4>
                <p>${journey.notes}</p>
            </div>
        `;

        marker.bindPopup(popupContent).addTo(map);
    });
}