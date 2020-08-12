// // wait for click on nav buttons
// watchNavButtons();

// function storageAvailable(type) {
//     try {
//         var storage = window[type],
//             x = '__storage_test__';
//         storage.setItem(x, x);
//         storage.removeItem(x);
//         return true;
//     }
//     catch(e) {
//         return e instanceof DOMException && (
//             // everything except Firefox
//             e.code === 22 ||
//             // Firefox
//             e.code === 1014 ||
//             // test name field too, because code might not be present
//             // everything except Firefox
//             e.name === 'QuotaExceededError' ||
//             // Firefox
//             e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//             // acknowledge QuotaExceededError only if there's something already stored
//             storage.length !== 0;
//     }
// }

// if (storageAvailable('sessionStorage')) {
//     // Nous pouvons utiliser localStorage
//     console.log('le stockage de type sessionStorage est fonctionnel !');
// }
// else {
//     // Malheureusement, localStorage n'est pas disponible
//     console.log('no no');
// }

const isStorageAvail = isStorageAvailable();

if (!isStorageAvail) {
    welcomeDiv.innerHTML = 'Le stockage de données est désactivé ou non pris en charge par votre navigateur. Cette fonctionnalité est indispensable au bon fonctionnemnt de ce site.<br> Merci de recharger cette page après avoir activé le localStorage et le sessionStorage, ou utilisez un autre navigateur web comme Chrome ou Edge.'
    welcomeDiv.classList.remove('d-none');
    navDiv.classList.add('d-none');
}
else {
    // wait for click on nav buttons
    watchNavButtons();
    // wait for a user not logged form submit
    watchNavUserNotLogged();
}