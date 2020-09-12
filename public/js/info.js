const watchInfos = () => {
    // hide/show the form
    const showNewInfoBtn = document.querySelector('#show-new-info-btn');
    const hideNewInfoBtn = document.querySelector('#hide-new-info-btn');
    const newInfoDiv = document.querySelector('#new-info-div');
    // form
    const newInfoForm = document.querySelector('#new-info-form');
    // form content
    const newInfoVersionInput = document.querySelector('#new-info-version');
    const newInfoTitleInput = document.querySelector('#new-info-title');
    const newInfoMessageInput = document.querySelector('#new-info-message');


    showNewInfoBtn.addEventListener('click', () => {
        newInfoDiv.classList.remove('d-none');
    });


    hideNewInfoBtn.addEventListener('click', () => {
        newInfoDiv.classList.add('d-none');
    });


    newInfoForm.addEventListener('click', (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const data = {
            "version": newInfoVersionInput.value,
            "title": newInfoTitleInput.value,
            "message": newInfoMessageInput.value
        };
        fetch('/infos/new', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application:json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) sendNotification('error', response.error);
        })
    });
};