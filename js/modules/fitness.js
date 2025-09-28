const fitnessData = {
    data: null
}

const fitnessContainer = document.getElementById('fitness-data')

export async function displayFitnessData() {
    await fetchFitnessData();
    renderFitnessData();
}

async function fetchFitnessData() {
    try {
        const response = await fetch('/json/fitness.json');
        if (!response.ok) {
            throw new Error('Could not load data.');
        }
        fitnessData.data = await response.json();

    } catch (error) {
        console.error('Error fetching fitness data:', error);
        if (fitnessContainer) {
            fitnessContainer.innerHTML = '<p>Failed to load information. Please try again later.</p>';
        }
        return null;
    }
}

function renderFitnessData() {
    const fitnessContainer = document.getElementById('fitness-data')

    if (!fitnessData.data) {
        throw new Error('No data!', fitnessData.data);
    }

    const data = fitnessData.data;
    const activitiesList = data.activities.map(activity => `<li>${activity}</li>`).join('');
    const liftsList = Object.keys(data.max_lifts).map(key => {
        if (key !== 'weight_class') {
            return `<li><strong>${key.replace('_', ' ')}:</strong> ${data.max_lifts[key]}</li>`;
        }
        return '';
    }).join('');
    const runsList = Object.keys(data.fastest_runs).map(key => {
        return `<li><strong>${key}:</strong> ${data.fastest_runs[key]}</li>`;
    }).join('');

    const fitnessElement = document.createElement('div');
    fitnessElement.innerHTML = `
    <dl class="fitness-data">
        <dt>Motivation</dt>
        <dd>${data.motivation}</dd>

        <dt>Activities</dt>
        <dd><ul>${activitiesList}</ul></dd>

        <dt>Max Lifts</dt>
        <dd>
            <p>Weight Class: <span>${data.max_lifts.weight_class}</span></p>
            <ul>${liftsList}</ul>
        </dd>

        <dt>Fastest Runs</dt>
        <dd><ul>${runsList}</ul></dd>

        <dt>Longest Run</dt>
        <dd>${data.longest_run}</dd>
    </dl>
        `;

    fitnessContainer.innerHTML = ''
    fitnessContainer.appendChild(fitnessElement);

}
