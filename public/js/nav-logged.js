const watchNavUserLoggedForms = () => {
    // welcome div
    const welcomeDiv = document.querySelector('#welcome');
    // nav container
    const navDiv = document.querySelector('#nav-div');

    // logout form
    const logoutForm = document.querySelector('#user-logout-form');
    const logoutInput = document.querySelector('#logout-all-devices');
    
    
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
    }
};