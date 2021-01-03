const gridInfosDiv = document.querySelector('#grid-infos');
const gridInfosCloseBtn = document.querySelector('#grid-infos-close');

gridInfosCloseBtn.addEventListener('click', (event) => {
    gridInfosDiv.classList.add('d-none');
});