const loginForm = document.querySelector('#login-form');
const loginEmailInput = document.querySelector('#log-email');
const loginPasswordInput = document.querySelector('#log-password');

loginForm.addEventListener('submit', (e) => {

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
        document.querySelector('#testlol').innerHTML = 'Bienvenue ' + response.user.name;
    })
});