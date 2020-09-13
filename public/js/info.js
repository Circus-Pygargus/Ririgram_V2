const watchInfos = () => {
    // hide/show the new info form
    const showNewInfoBtn = document.querySelector('#show-new-info-btn');
    const hideNewInfoBtn = document.querySelector('#hide-new-info-btn');
    const newInfoDiv = document.querySelector('#new-info-div');
    // form
    const newInfoForm = document.querySelector('#new-info-form');
    // form content
    const newInfoVersionInput = document.querySelector('#new-info-version');
    const newInfoTitleInput = document.querySelector('#new-info-title');
    const newInfoMessageInput = document.querySelector('#new-info-message');
    // infos place
    const infosDiv = document.querySelector('#infos');


    showNewInfoBtn.addEventListener('click', () => {
        newInfoDiv.classList.remove('d-none');
    });


    hideNewInfoBtn.addEventListener('click', (e) => {
        // because the btn is inside the form, and it would submit the form even if not a submit typed button
        e.preventDefault();
        newInfoDiv.classList.add('d-none');
    });


    newInfoForm.addEventListener('submit', (e) => {
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
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) return sendNotification('error', response.error);

            infosDiv.innerHTML = response.html;
            newInfoDiv.classList.add('d-none');
            sendNotification('success', 'Nouvelle info enregistrée !');
        })
    });
};