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
    const infoShowBtns = document.querySelectorAll('.info-show');


    // show new info form
    if (showNewInfoBtn) {
        showNewInfoBtn.addEventListener('click', () => {
            newInfoDiv.classList.remove('d-none');
        });
    }

    // hide new infos form
    hideNewInfoBtn.addEventListener('click', (e) => {
        // because the btn is inside the form, and it would submit the form even if not a submit typed button
        e.preventDefault();
        newInfoDiv.classList.add('d-none');
    });


    // new info submit
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


    // show/hide an info message
    infoShowBtns.forEach(infoshowBtn => {
        infoshowBtn.addEventListener('click', (e) => {
            // sometimes e.target is the svg <path>
            const arrowBtn = e.target.tagName.toUpperCase() === 'SVG' ? e.target : e.target.parentNode;
            const infoId = arrowBtn.dataset.infoId;
            // associated message container
            const messageDiv = document.querySelector(`.info-message[data-info-id="${infoId}"`);
            // hide message
            if (arrowBtn.classList.contains('up')) {
                messageDiv.classList.add('d-none');
                arrowBtn.classList.remove('up');
            }
            // show message
            else {
                // Message is missing, request it
                if (!messageDiv.classList.contains('filled')) {
                    const data = { "infoId": infoId };
                    const token = sessionStorage.getItem('token');

                    fetch('/infos/one', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${JSON.parse(token)}`
                        }
                    })
                    .then(response => response.json())
                    .then(response => {
                        if (response.error) return sendNotification('error', response.error);

                        messageDiv.innerHTML = response.message;
                    })
                }                
                // if message is already there too ;)
                messageDiv.classList.remove('d-none');
                arrowBtn.classList.add('up');
            }
        });
    });
};