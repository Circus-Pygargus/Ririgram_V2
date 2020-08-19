const watchNavUserNotLogged = () => {
    // welcome div
    const welcomeDiv = document.querySelector('#welcome');
    // nav container
    const navDiv = document.querySelector('#nav-div');

    // Login form
    const loginForm = document.querySelector('#login-form');
    const loginEmailInput = document.querySelector('#log-email');
    const loginPasswordInput = document.querySelector('#log-password');

    // Register form
    const registerForm = document.querySelector('#register-form');
    const registerNameInput = document.querySelector('#register-name');
    const registerEmailInput = document.querySelector('#register-email');
    const registerPassword = document.querySelector('#register-password');
    const registerPasswordBis = document.querySelector('#register-password-bis');

    // test game button
    const testGameBtn = document.querySelector('#test-game');

    // // Title div
    // const titleDiv = document.querySelector('#main-title');

    // // Main content place (gameboard, grid list ...)
    // const mainContentDiv = document.querySelector('#main-content');


    // loginForm exists so user not logged navbar is displayed
    if (loginForm) {

        // user tries to log in
        loginForm.addEventListener('submit', (event) => {
    
            event.preventDefault();
            
            const data = {
                "email": loginEmailInput.value,
                "password": loginPasswordInput.value
            }
    
            fetch('/users/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                console.log(response.user)
                welcomeDiv.innerHTML = 'Bienvenue ' + response.user.name;
                welcomeDiv.classList.remove('d-none');
                navDiv.innerHTML = response.html;
                sessionStorage.setItem('token', JSON.stringify(response.token));
                // wait for click on new nav buttons
                watchNavButtons();
                // wait for a user logged form submit
                watchNavUserLoggedForms();
            })
        });


        // User tries to register
        registerForm.addEventListener('submit', (event) => {

            event.preventDefault();

            const data = {
                "name": registerNameInput.value,
                "email": registerEmailInput.value,
                "password": registerPassword.value,
                "password-bis": registerPasswordBis.value
            }
            // TODO : ajouter verif password === passwordBis
        });


        // User wants to test the game
        testGameBtn.addEventListener('click', (event) => {
            testGame();
        });
    }
};



const testGame = () => {
    
    fetch('/grid/test-game', {
        method: 'POST',
        headers: {
            "content-Type": "Application/json"
        }
    })
    .then((response) => {
        if (response.status !== 201) {
            console.log(response)
            throw new Error('Quelque chose s\'est mal déroulé pendant la création de la grille.');
        }
        return response.json();
    })
    .then((response) => {
        const { gridSolution, clicksNbForPerfectGame, rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers } = response;
        // cleanNavbar() est dans navbars.js
        cleanNavbar();
        // toggleNavbarBtn et navContainer proviennent de toggle-navbar.js
        toggleNavbarBtn.classList.remove('hidden');
        navContainer.classList.add('hidden');
        // move title
        // titleDiv.classList.add('in-game');
        document.querySelector('#main-title').classList.add('in-game');
        // build the gameboard, launch the game and manage it (false because user is not logged)
        gameManager(rowsNb, colsNb, rowsHelpers, maxRowHelpers, colsHelpers, maxColHelpers, false, gridSolution, clicksNbForPerfectGame);
    })
    .catch((e) => {
        // coller l'erreur dans une pop-up ?
        console.log(e)
    })
}