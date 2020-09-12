const watchInfos = () => {
    const showNewInfoBtn = document.querySelector('#show-new-info-btn');    
    const newInfoDiv = document.querySelector('#new-info-div');
    const hideNewInfoBtn = document.querySelector('#hide-new-info-btn');

    showNewInfoBtn.addEventListener('click', () => {
        newInfoDiv.classList.remove('d-none');
    });

    hideNewInfoBtn.addEventListener('click', () => {
        newInfoDiv.classList.add('d-none');
    });
};