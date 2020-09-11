const trashCanBtn = document.querySelector('#trash-can-btn');

const trashCanDiv = document.querySelector('#trash-can-div');

const trashCanConfirmedBtn = document.querySelector('#trash-confirmed');

const trashCanCancelledBtn = document.querySelector('#trash-cancelled');


trashCanBtn.addEventListener('click', () => {
    trashCanDiv.classList.remove('d-none');
});

trashCanCancelledBtn.addEventListener('click', () => {
    trashCanDiv.classList.add('d-none');
});

trashCanConfirmedBtn.addEventListener('click', (e) => {
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
        trashCanBtn.classList.add('d-none');
        trashCanDiv.classList.add('d-none');
        
        document.querySelector('#main-title').classList.remove('in-game');
        gameZone.classList.add('d-none');
        document.querySelector('#nav-div').classList.remove('hidden');
    })
    .catch(e => {
        console.log(e);
    })
});