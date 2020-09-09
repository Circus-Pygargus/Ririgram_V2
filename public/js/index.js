const isStorageAvail = isStorageAvailable();

if (!isStorageAvail) {
    const noJSDiv = document.querySelector('#no-js');
    const navDiv = document.querySelector('#nav-div');
    noJSDiv.innerHTML = 'Le stockage de données est désactivé ou non pris en charge par votre navigateur. Cette fonctionnalité est indispensable au bon fonctionnemnt de ce site.<br> Merci de recharger cette page après avoir activé le localStorage et le sessionStorage, ou utilisez un autre navigateur web comme Chrome ou Edge.'
    noJSDiv.classList.remove('d-none');
    navDiv.classList.add('d-none');
}
else {
    // wait for click on nav buttons
    watchNavButtons();
    // wait for a user not logged form submit
    watchNavUserNotLogged();
}


/* About mouse buttons */

// Disable right click context menu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Text selection is disabled in main.scss


// react when user push a game button (game cross or color answer)
watchGameButtons();
watchCrossButtons();