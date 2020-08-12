const watchNavUserNotLogged = () => {
    // welcome div
    const welcomeDiv = document.querySelector('#welcome');
    // nav container
    const navDiv = document.querySelector('#nav-div');

    // Login form
    const loginForm = document.querySelector('#login-form');
    const loginEmailInput = document.querySelector('#log-email');
    const loginPasswordInput = document.querySelector('#log-password');


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
};