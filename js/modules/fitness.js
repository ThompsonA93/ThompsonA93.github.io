const fitnessData = {
    data: null
}

export async function displayFitnessData() {
    if(fitnessData.data == null){
        await fetchFitnessData();
    }

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

    const activitiesList = data.activities.map(activity => 
        `<li class="fitness__list-item">${activity}</li>`
    ).join('');

    const liftsTableBody = Object.keys(data.max_lifts).map(key => {
        if (key !== 'weight_class') {
            let exercise = key.replace('_', ' ');
            // Capitalize the first letter of the exercise name
            let capitalizedExercise = exercise.charAt(0).toUpperCase() + exercise.slice(1);
            
            return `
                <tr class="fitness__table-row">
                    <td class="fitness__table-cell fitness__table-cell--label">${capitalizedExercise}</td>
                    <td class="fitness__table-cell fitness__table-cell--value">${data.max_lifts[key]}</td>
                </tr>
            `;
        }
        return '';
    }).join('');

    const runsTableBody = Object.keys(data.fastest_runs).map(key => {
        return `
            <tr class="fitness__table-row">
                <td class="fitness__table-cell fitness__table-cell--label">${key}</td>
                <td class="fitness__table-cell fitness__table-cell--value">${data.fastest_runs[key]}</td>
            </tr>
        `;
    }).join('');

    fitnessContainer.innerHTML = '';
    fitnessContainer.innerHTML = `
<div class="fitness__dataset">
    <p class="fitness__dataset-detail">Motivation:</p>
    <span class="fitness__dataset-value">${data.motivation}</span>

    <p class="fitness__dataset-detail">Activities:</p>
    <ul class="fitness__list">${activitiesList}</ul>   

    <p class="fitness__dataset-detail">Weight category:</p>
    <span class="fitness__dataset-value">${data.max_lifts.weight_class}</span>
</div>

<div class="fitness__dataset">
    <p class="fitness__dataset-detail">Weight training</p>
    <table class="fitness__table">
        <tbody class="fitness__table-body">
            ${liftsTableBody}
        </tbody>
    </table>
    <p class="fitness__dataset-detail">Running</p>
    <table class="fitness__table">
        <tbody class="fitness__table-body">
            ${runsTableBody}
        </tbody>
    </table>
    <p class="fitness__dataset-detail">Longest Run:</p>
    <span class="fitness__dataset-value">${data.longest_run}</span>
    </div>
    `;
}