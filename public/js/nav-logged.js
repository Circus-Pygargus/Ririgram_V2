const watchNavUserLoggedForms = () => {
    // nav container
    const navDiv = document.querySelector('#nav-div');

    // account modification form
    const accountModifForm = document.querySelector('#change-account-form');

    // logout form
    const logoutForm = document.querySelector('#user-logout-form');
    const logoutInput = document.querySelector('#logout-all-devices');

    // new grid form
    const newGridForm = document.querySelector('#new-grid-form');
    const rowsNbInput = document.querySelector('#rows-nb-input');
    const colsNbInput = document.querySelector('#cols-nb-input');
    const newGridFormBtn = document.querySelector('#new-grid-form-btn');
    
    
    // if logoutForm exists, then user is logged, so we're using these event listeners
    if (logoutForm) {

        // User wants to change his account
        accountModifForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendNotification('info', 'Ce formulaire ne fonctionne pas pour l\'instant.');
        });



        // logout user
        logoutForm.addEventListener('submit', (event) => {

            event.preventDefault();
            
            const token = sessionStorage.getItem('token');

            // User wants to disconnect from all his devices
            if (logoutInput.checked) {
                fetch('/users/logoutall', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    // user is disconnected, display user not logged navbar
                    if (!response.html) return sendNotification('error', response.error);

                    navDiv.innerHTML = response.html;
                    sessionStorage.removeItem('token');
                    // 'Déconnexion de tous vos appareils effectuée avec succès.'
                    sendNotification('info', 'Tous tes appareils sont déconnectés.');
                    // wait for click on nav buttons
                    watchNavButtons();
                    // wait for a user not logged form submit
                    watchNavUserNotLogged();
                })
            }
            // User wants to disconnect from one device
            else {
                fetch('/users/logout', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "Application/json",
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                })
                .then ((response) => {
                    return response.json();
                })
                .then((response) => {
                    // user is disconnected, display user not logged navbar
                    if (!response.html) return sendNotification('error', response.error);
                    
                    navDiv.innerHTML = response.html;
                    sessionStorage.removeItem('token');
                    //'Déconnexion de cet appareil effectuée avec succès.'
                    sendNotification('info', 'Tu es déconnecté.'); 
                    // wait for click on nav buttons
                    watchNavButtons();
                    // wait for a user not logged form submit
                    watchNavUserNotLogged();
                })
            }
        });



        newGridForm.addEventListener('submit' , (event) => {
            event.preventDefault();
            const rowsNb = rowsNbInput.value, 
                colsNb = colsNbInput.value;
            newGrid(rowsNb, colsNb);
        });



        /* Force to play with square grids */
        // user is entering a number
        rowsNbInput.addEventListener('keyup', (event) => {
            event.preventDefault();
            colsNbInput.value = rowsNbInput.value;
            checkValidity(event.target);
        });
        colsNbInput.addEventListener('keyup', (event) => {
            event.preventDefault();
            rowsNbInput.value = colsNbInput.value;
            checkValidity(event.target);
        });
        // user is using input arrows
        rowsNbInput.addEventListener('change', (event) => {
            event.preventDefault();
            colsNbInput.value = rowsNbInput.value;
            checkValidity(event.target);
        });
        colsNbInput.addEventListener('change', (event) => {
            event.preventDefault();
            rowsNbInput.value = colsNbInput.value;
            checkValidity(event.target);
        });
        const checkValidity = (input) => {
            input.validity.valid ? newGridFormBtn.classList.remove('invalid') : newGridFormBtn.classList.add('invalid');
        };
    }
};

const newGrid = (rowsNb, colsNb) => {
    const token = sessionStorage.getItem('token');
    const data = {
        "rowsNb": rowsNb,
        "colsNb": colsNb
    }
    fetch('/grid/new', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(token)}`
        }
    })
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        if (response.error) sendNotification('error', response.error);
        
        const { rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame, gridId, gridNbTimesPlayed, gridNbTimesFinished, gridNbPlayersFinished, gridNbPlayersTrashed } = response;
        // cleanNavbar() est dans navbars.js
        cleanNavbar();
        // toggleNavbarBtn et navContainer proviennent de toggle-navbar.js
        toggleNavbarBtn.classList.remove('hidden');
        navContainer.classList.add('hidden');
        // move title
        document.querySelector('#main-title').classList.add('in-game');
        // build the gameboard, launch the game and manage it (true because user is logged, and '' because we don't know the grid solution)
        gameManager(rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, true, '', clicksNbForPerfectGame, gridId, gridNbTimesPlayed, gridNbTimesFinished, gridNbPlayersFinished, gridNbPlayersTrashed);
    })
    .catch((e)=> {
        console.log(e);
        sendNotification('error', e);
    })
};