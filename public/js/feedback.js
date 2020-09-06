const watchForFeedback = () => {
    
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

            if (!response.html) return sendNotification('error', response.error);

            // insert messages received by server in DOM
            messagesDestination.innerHTML = response.html;
            watchActionsOnFeedbacks();
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
                watchActionsOnFeedbacks();
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


// watch all actions that are in displayed users messages
const watchActionsOnFeedbacks = () => {
    // Admin answer btn 
    const msgAnswerBtns = document.querySelectorAll('.msg-answer-btn');
    // Container used to show/hide answer form
    const answerFbFormContainer = document.querySelector('#answer-feedback-container');
    // answer form
    const answerFbForm = document.querySelector('#answer-fb-form');
    msgAnswerBtns.forEach(msgAnswerBtn => {
        msgAnswerBtn.addEventListener('click', (e) => {
            e.target.tagName === 'DIV' ? answerFbForm.dataset.id = e.target.dataset.id : answerFbForm.dataset.id = e.target.parentNode.dataset.id;           
            // answerFbForm.dataset.id = e.target.dataset.id;
            answerFbFormContainer.classList.remove('d-none');
        });
    });
};



const watchForAdminAnswer = () => {
    // Button used if admin does'nt want any more to send a response
    const closeAnswerFormBtn = document.querySelector('#close-answer-form-btn');
    // Container used to show/hide answer form
    const answerFbFormContainer = document.querySelector('#answer-feedback-container');
    // answer form
    const answerFbForm = document.querySelector('#answer-fb-form');
    // the answer message input
    const answerFbMsgTextarea = document.querySelector('#answer-fb-msg');
    // messages are displayed here
    const messagesDestination = document.querySelector('#messages');

    closeAnswerFormBtn.addEventListener('click', (e) => {
        answerFbForm.removeAttribute('data-id');
        answerFbMsgTextarea.value = '';
        answerFbFormContainer.classList.add('d-none');
    });    

    
    answerFbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedbackId = e.target.dataset.id;
        const data = {
            feedbackId,
            message: answerFbMsgTextarea.value };
        const token = sessionStorage.getItem('token');
        fetch('/feedback/answer', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => response.json())
        .then(response => {

            if (!response.html) return sendNotification('error', response.error);
    
            sendNotification('success', 'Réponse enregistrée.');        
            messagesDestination.innerHTML = response.html;
            answerFbMsgTextarea.value = '';
            answerFbFormContainer.classList.add('d-none');
            console.log(document.querySelector(`.delete[data-id="${feedbackId}"`))
            document.querySelector(`.delete[data-id="${feedbackId}"`).scrollIntoView({ behavior: 'smooth' });
        })
    });
}