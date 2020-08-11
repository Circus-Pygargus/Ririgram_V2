const loginForm = document.querySelector('#login-form');
const loginEmailInput = document.querySelector('#log-email');
const loginPasswordInput = document.querySelector('#log-password');
let webToken = '';
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
        document.querySelector('#welcome').innerHTML = 'Bienvenue ' + response.user.name;
        document.querySelector('#nav-div').innerHTML = response.html;
        // webToken = response.token;
        localStorage.setItem('token', JSON.stringify(response.token));
        // tryToUnlog()
        // document.querySelector('#logged-test').addEventListener('click', (e) => {
        //     const token = localStorage.getItem('token');
        //     fetch('/users/logout', {
        //         method: 'POST',
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${JSON.parse(token)}`
        //         }
        //     })
        //     // .then((response) => {
        //     //     return response.json();
        //     // })
        //     .then((response) => {
        //         console.log(response)
        //     })
        // });
        watchNavButtons();
    })
});