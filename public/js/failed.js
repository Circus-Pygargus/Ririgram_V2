const failedDiv = document.querySelector('#failed');
const failedCloseBtns = document.querySelectorAll('.failed-close');
const failedMessagePlace = document.querySelector('#failed-message');

const failed = (failedMessage) => {
    failedMessagePlace.innerHTML = failedMessage;
    failedDiv.classList.remove('d-none');
};

failedCloseBtns.forEach((failedCloseBtn) => {
    failedCloseBtn.addEventListener('click', () => {
        failedDiv.classList.add('d-none');
    });
});