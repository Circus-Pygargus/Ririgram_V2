const watchNavUserLoggedForms = () => {
    // welcome div
    const welcomeDiv = document.querySelector('#welcome');
    // nav container
    const navDiv = document.querySelector('#nav-div');

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
                    if (response.html) {                        
                        welcomeDiv.innerHTML = 'Déconnexion de tous vos appareils effectuée avec succès.';
                        welcomeDiv.classList.remove('d-none');
                        navDiv.innerHTML = response.html;
                        sessionStorage.removeItem('token');
                        // wait for click on nav buttons
                        watchNavButtons();
                        // wait for a user not logged form submit
                        watchNavUserNotLogged();
                    }
                    // TODO : manque gestion des erreurs !
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
                    if (response.html) {                        
                        welcomeDiv.innerHTML = 'Déconnexion de cet appareil effectuée avec succès.';
                        welcomeDiv.classList.remove('d-none');
                        navDiv.innerHTML = response.html;
                        sessionStorage.removeItem('token');
                        // wait for click on nav buttons
                        watchNavButtons();
                        // wait for a user not logged form submit
                        watchNavUserNotLogged();
                    }
                    // TODO : manque gestion des erreurs !
                })
            }
        });



        newGridForm.addEventListener('submit' , (event) => {
            event.preventDefault();
            const token = sessionStorage.getItem('token');
            const data = {
                "rowsNb": rowsNbInput.value,
                "colsNb": colsNbInput.value
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
                const { rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, clicksNbForPerfectGame, gridId } = response;
                // cleanNavbar() est dans navbars.js
                cleanNavbar();
                // toggleNavbarBtn et navContainer proviennent de toggle-navbar.js
                toggleNavbarBtn.classList.remove('hidden');
                navContainer.classList.add('hidden');
                // move title
                // titleDiv.classList.add('in-game');
                document.querySelector('#main-title').classList.add('in-game');
                // build the gameboard, launch the game and manage it (true because user is logged, and '' because we don't know the grid solution)
                gameManager(rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, true, '', clicksNbForPerfectGame, gridId);
            })
            .catch((e)=> {
                console.log(e);
            })
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