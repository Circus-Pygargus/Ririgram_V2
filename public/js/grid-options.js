// container
const gridOptionsDiv = document.querySelector('#grid-options');
// content
const gridTrashBtn = document.querySelector('#grid-trash-btn');
const resetGridBtn = document.querySelector('#reset-grid-btn');
const maybeResetBtn = document.querySelector('#maybe-reset-btn');

// grid trash div
const gridTrashDiv = document.querySelector('#grid-trash-div');
const gridTrashConfirmBtn = document.querySelector('#grid-trash-confirmed');
const gridTrashCancelBtn = document.querySelector('#grid-trash-cancelled');


gridTrashBtn.addEventListener('click', () => {
    gridTrashDiv.classList.remove('d-none');
});

gridTrashCancelBtn.addEventListener('click', () => {
    gridTrashDiv.classList.add('d-none');
});

gridTrashConfirmBtn.addEventListener('click', (e) => {
    // gridId is defined in gameManager
    const token = sessionStorage.getItem('token');

    const data = { "gridId": gridId }

    fetch('/grid/trashcan', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(token)}`
        }
    })
    .then(response => response.json())
    .then(response => {
        if (!response.message) return sendNotification('error', response.error);

        sendNotification('success', response.message);
        gridOptionsDiv.classList.add('d-none');
        gridTrashDiv.classList.add('d-none');
        
        document.querySelector('#main-title').classList.remove('in-game');
        gameZone.classList.add('d-none');
        document.querySelector('#nav-div').classList.remove('hidden');
    })
    .catch(e => {
        console.log(e);
    })
});


resetGridBtn.addEventListener('click', (e) => {
    tiles.forEach(tile => {
        tile.dataset.solution = 'default';
    });
});


maybeResetBtn.addEventListener('click', (e) => {
    tiles.forEach(tile => {
        if (tile.dataset.solution === 'maybe-yes' || tile.dataset.solution === 'maybe-no') {
            tile.dataset.solution = 'default';
        }
    });
});