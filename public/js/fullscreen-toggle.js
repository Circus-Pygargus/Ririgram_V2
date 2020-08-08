// Get the documentElement (<html>) to display the page in fullscreen
const elemHtml = document.documentElement;
const goFullscreenBtn = document.querySelector('#go-fullscreen');
const exitFullscreenBtn = document.querySelector('#exit-fullscreen');


/* View in fullscreen 
    Here we could use any html element
*/
const openFullscreen = () => {
    if (elemHtml.requestFullscreen) {
        elemHtml.requestFullscreen();
    } else if (elemHtml.mozRequestFullScreen) { /* Firefox */
        elemHtml.mozRequestFullScreen();
    } else if (elemHtml.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elemHtml.webkitRequestFullscreen();
    } else if (elemHtml.msRequestFullscreen) { /* IE/Edge */
        elemHtml.msRequestFullscreen();
    }
}

/* Close fullscreen 
    Here we must use document or it won't work
*/
const closeFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
};

goFullscreenBtn.addEventListener('click', (e) => {
    e.target.classList.add('d-none');
    exitFullscreenBtn.classList.remove('d-none');
    openFullscreen();
});

exitFullscreenBtn.addEventListener('click', (e) => {
    e.target.classList.add('d-none');
    goFullscreenBtn.classList.remove('d-none');
    closeFullscreen();
});