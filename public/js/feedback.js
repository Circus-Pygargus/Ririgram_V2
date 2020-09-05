const watchFeedback = () => {
    
    const fbForm = document.querySelector('#feedback-form');
    const fbTypeSelect = document.querySelector('#feedback-type');
    const fbDeviceLabel = document.querySelector('label[for="feedback-device"]');
    const fbDeviceInput = document.querySelector('#feedback-device');
    const fbBrowserLabel = document.querySelector('label[for="feedback-browser"]');
    const fbBrowserInput = document.querySelector('#feedback-browser');
    const fbMessageInput = document.querySelector('#feedback-message');

    // btn to ask for messages
    const seeFeedbacksBtn = document.querySelector('#feedbacks');

    // messages are displayed here
    const messagesDestination = document.querySelector('#messages');
    

    /**
     * Set or remove require attribute to some inputs
     * 
     * @param {boolean} isrequired true means message type is Bug
     */
    const setRequired = (isrequired) => {
        if (!isrequired) {
            fbDeviceInput.removeAttribute('required');
            fbBrowserInput.removeAttribute('required');
            fbDeviceLabel.classList.remove('required');
            fbBrowserLabel.classList.remove('required');
        }
        else {
            fbDeviceInput.setAttribute('required', '');
            fbBrowserInput.setAttribute('required', '');
            fbDeviceLabel.classList.add('required');
            fbBrowserLabel.classList.add('required');
        }
    };




    // if user wants to report a bug, then he must tell about his device and browser
    fbTypeSelect.addEventListener('change', (e) => {
        e.target.value === 'Bug' ? setRequired(true) : setRequired(false);
    });

    // User tries to send a feedback
    fbForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = {
            "type": fbTypeSelect.value,
            "device": fbDeviceInput.value,
            "browser": fbBrowserInput.value,
            "message": fbMessageInput.value
        }
        const token = sessionStorage.getItem('token');

        fetch('/feedback/new', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            if (!response.html) {
                // !! manque gestion des erreurs
            }
            else {
                // insert messages received by server in DOM
                messagesDestination.innerHTML = response.html;
                // inform user
                sendNotification('success', 'Ton message a été enregistré.');
                // give back the form his default state
                fbTypeSelect.selectedIndex = 0;
                fbDeviceInput.value = '';
                fbBrowserInput.value = '';
                fbMessageInput.value = '';
                // show message to user
                // here we simulate a click action on the nav button
                document.querySelector('#feedbacks').click();
            }
        })
    });


    // User wants to see messages
    seeFeedbacksBtn.addEventListener('click', (e) => {
        const token = sessionStorage.getItem('token');
        fetch('/feedback/list', {
            method: 'POST',
            headers: {
                "Content-Type": "application:json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
            if (!response.html) sendNotification('error', response.error);
            else {
                // insert messages received by server in DOM
                messagesDestination.innerHTML = response.html;
                // const dates = messagesDestination.querySelectorAll('.date');
                // dates.forEach((elem) => {
                //     const date = new Date(elem)
                //     console.log(date.toLocaleString('en-GB', { timeZone: 'UTC' }))
                // });
                seeFeedbacksBtn.scrollIntoView({ behavior: 'smooth' });
            }
        })
    });
};