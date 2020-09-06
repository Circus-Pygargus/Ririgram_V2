/* Here we hide/display the navbar */

const toggleNavbarBtn = document.querySelector('#toggle-navbar');

const navContainer = document.querySelector('#nav-div');

// grid and game buttons
const gameZone = document.querySelector('#game-zone');


toggleNavbarBtn.addEventListener('click', (e) => {

        navContainer.classList.toggle('hidden');

        if (document.querySelector('#main-title').classList.contains('in-game')) gameZone.classList.toggle('d-none');
});