/* Here we hide/display the navbar */

const toggleNavbarBtn = document.querySelector('#toggle-navbar');

const navContainer = document.querySelector('#nav-div');


toggleNavbarBtn.addEventListener('click', (e) => {

    if (!toggleNavbarBtn.classList.contains('hidden')) {
        navContainer.classList.toggle('hidden');
    }
});