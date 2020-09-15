// some operation are in watchNewInfo() because some buttons are reloaded multiple times, here they're not
const watchInfos = () => {

    // hide/show the new info form
    const hideNewInfoBtn = document.querySelector('#hide-new-info-btn');
    const newInfoDiv = document.querySelector('#new-info-div');

    // new info form
    const newInfoForm = document.querySelector('#new-info-form');
    // new info form content
    const newInfoVersionInput = document.querySelector('#new-info-version');
    const newInfoTitleInput = document.querySelector('#new-info-title');
    const newInfoMessageInput = document.querySelector('#new-info-message');
    // infos place
    const infosDiv = document.querySelector('#infos');
    // hide/show the change info form
    const hideChangeInfoBtn = document.querySelector('#hide-change-info-btn');
    const changeInfoDiv = document.querySelector('#change-info-div');
    // change info form
    const changeInfoForm = document.querySelector('#change-info-form');
    // change info form content
    const changeInfoVersionInput = document.querySelector('#change-info-version');
    const changeInfoTitleInput = document.querySelector('#change-info-title');
    const changeInfoMessageTextarea = document.querySelector('#change-info-message');
    // hide/show the confirm delete info div
    const hideDeleteInfoBtn = document.querySelector('#abort-delete-info');
    const deleteInfoDiv = document.querySelector('#delete-info-div');
    // confirm delete info
    const confirmDeleteInfo = document.querySelector('#confirm-delete-info');



    // hide new infos form  __ only for admin
    if (hideNewInfoBtn) {
        hideNewInfoBtn.addEventListener('click', (e) => {
            // because the btn is inside the form, and it would submit the form even if not a submit typed button
            e.preventDefault();
            newInfoDiv.classList.add('d-none');
        });
    }


    // new info submit  __ only for admin
    if (newInfoForm) {
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
                // html content has been replaced, watch it
                watchNewInfos();
            })
        });
    }

    // hide change infos form  __ only for admin
    if (hideChangeInfoBtn) {
        hideChangeInfoBtn.addEventListener('click', (e) => {
            // because the btn is inside the form, and it would submit the form even if not a submit typed button
            e.preventDefault();
            changeInfoDiv.classList.add('d-none');
        });
    }

    // hide change infos form  __ only for admin
    if (hideChangeInfoBtn) {
        hideChangeInfoBtn.addEventListener('click', (e) => {
            // because the btn is inside the form, and it would submit the form even if not a submit typed button
            e.preventDefault();
            changeInfoDiv.classList.add('d-none');
        });
    }

    // change info submit  __ only for admin
    if (changeInfoForm) {
        changeInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            return sendNotification('error', 'Cette fonctionnalité a été désactivée');
            const token = sessionStorage.getItem('token');
            const data = {
                "_id": changeInfoForm.dataset.infoId,
                "version": changeInfoVersionInput.value,
                "title": changeInfoTitleInput.value,
                "message": changeInfoMessageTextarea.innerHTML
            };
            fetch('/infos/update/one', {
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
                const cleanedMessage = br2ln(response.html);
                infosDiv.innerHTML = cleanedMessage;
                // infosDiv.innerHTML = response.html;
                changeInfoDiv.classList.add('d-none');
                sendNotification('success', 'Modification de l\'info enregistrée !');
                // html content has been replaced, watch it
                watchNewInfos();
            })
        });
    }

    // hide confirm info div   __ only for admin
    if (hideDeleteInfoBtn) {
        hideDeleteInfoBtn.addEventListener('click', (e) => {
            deleteInfoDiv.classList.add('d-none');
        });
    }

    // delete info
    if (confirmDeleteInfo) {
        confirmDeleteInfo.addEventListener('click', (e) => {
            const infoId = e.target.dataset.infoId;
            if (!infoId) return sendNotification('error', 'L\'id de l\'info n\'est pas inscrit dans ce bouton !');

            const data = {
                "infoId": infoId
            };
            const token = sessionStorage.getItem('token');
            fetch('/infos/delete', {
                method: 'DELETE',
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
                deleteInfoDiv.classList.add('d-none');
                sendNotification('success', 'Cette info a été effacée de la base de données.');
                watchNewInfos();
            })
        });
    }

    watchNewInfos();
};


const watchNewInfos = () => {
    // hide/show the new info form
    const showNewInfoBtn = document.querySelector('#show-new-info-btn');
    const newInfoDiv = document.querySelector('#new-info-div');

    // infos place
    const infoShowBtns = document.querySelectorAll('.info-show');
    
    // hide/show the change info form
    const showChangeInfoBtns = document.querySelectorAll('.info-pencil');
    const changeInfoDiv = document.querySelector('#change-info-div');
    // change info form
    const changeInfoForm = document.querySelector('#change-info-form');
    // change info form content
    const changeInfoVersionInput = document.querySelector('#change-info-version');
    const changeInfoTitleInput = document.querySelector('#change-info-title');
    const changeInfoMessageTextarea = document.querySelector('#change-info-message');
    
    // hide/show the confirm delete info div
    const showDeleteInfoBtns = document.querySelectorAll('.trash-info');
    const deleteInfoDiv = document.querySelector('#delete-info-div');
    // confirm delete info
    const confirmDeleteInfo = document.querySelector('#confirm-delete-info');


const br2ln = (str) => {
    const searchStr = '<br>';
    const replaceStr = '/r/n';
    return str.split(searchStr).join(replaceStr);
    // const breakTag = '/r/n';
    // return (str + '').replace(/([<br>])/g, '$1' + breakTag + '$2');
};


    // show new info form  __ only for admin
    if (showNewInfoBtn) {
        showNewInfoBtn.addEventListener('click', () => {
            newInfoDiv.classList.remove('d-none');
        });
    }


    // show change info form  __ only for admin
    if (showChangeInfoBtns) {
        showChangeInfoBtns.forEach(showChangeInfoBtn => {
            showChangeInfoBtn.addEventListener('click', (e) => {
                const infoId = e.target.closest('svg').dataset.infoId;
                changeInfoForm.dataset.infoId = infoId;
                changeInfoVersionInput.value = document.querySelector(`div.info-version[data-info-id="${infoId}"]`).innerHTML;
                changeInfoTitleInput.value = document.querySelector(`div.info-title[data-info-id="${infoId}"]`).innerHTML;
                changeInfoMessageTextarea.innerHTML = document.querySelector(`div.info-message[data-info-id="${infoId}"]`).innerHTML;
                changeInfoDiv.classList.remove('d-none');
            });
        });
    }

    // show  confirm info div  __ only for admin
    if (showDeleteInfoBtns) {
        showDeleteInfoBtns.forEach(showDeleteInfoBtn => {
            showDeleteInfoBtn.addEventListener('click', (e) => {
                const infoId = e.target.closest('svg').dataset.infoId;
                confirmDeleteInfo.dataset.infoId = infoId;
                deleteInfoDiv.classList.remove('d-none');
            });
        });
    }

    // show/hide an info message
    infoShowBtns.forEach(infoshowBtn => {
        infoshowBtn.addEventListener('click', (e) => {
            // sometimes e.target is the svg <path>
            // const arrowBtn = e.target.tagName.toUpperCase() === 'SVG' ? e.target : e.target.parentNode;
            const arrowBtn = e.target.closest('svg');
            const infoId = arrowBtn.dataset.infoId;
            // associated svg for change info
            const svgChange = document.querySelector(`svg.info-pencil[data-info-id="${infoId}"]`);
            // associated svg for delete info
            const svgDelete = document.querySelector(`svg.trash-info[data-info-id="${infoId}"]`);
            // associated message container
            const messageDiv = document.querySelector(`.info-message[data-info-id="${infoId}"`);
            // hide message
            if (arrowBtn.classList.contains('up')) {
                // only for admin
                if (svgChange) {
                    svgChange.classList.add('d-none');
                    svgDelete.classList.add('d-none');
                }
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
                        messageDiv.classList.add('filled');
                        
                        // watch if user reads an unseen info
                        if (arrowBtn.classList.contains('not-seen')) {
                            arrowBtn.classList.remove('not-seen');
                            // '!' is handled by .info-version.not-seen::before
                            document.querySelector(`.info-version[data-info-id="${infoId}"`).classList.remove('not-seen');
                            manageInfosExclamMarks();
                        }
                    })
                }
                // if message is already there too ;)
                // only for admin
                if (svgChange) {
                    svgChange.classList.remove('d-none');
                    svgDelete.classList.remove('d-none');
                }
                messageDiv.classList.remove('d-none');
                arrowBtn.classList.add('up');
            }
        });
    });
};


// remove info related exclamation marks when user read an unseen info
const manageInfosExclamMarks = () => {
    console.log('exclam marks')
    // try to get one exclamation mark (it's a div.info-version::before)
    const exclamMark = document.querySelector('.info-version.not-seen');
    // some '!' are still present, do nothing
    if (exclamMark) return;

    // no more '!' for infos, remove '!' in navbar headers btns
    document.querySelector('#nav-infos').classList.remove('new-things');

    // AJOUTER ICI LA VERIF DE PRESENCE DE '!' DANS LES MESSAGES AVANT D'EFFACER CE DERNIER '!'
    document.querySelector('#between-us').classList.remove('new-things');
};