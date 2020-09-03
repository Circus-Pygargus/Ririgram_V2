/**
 * Sends notification to user
 * 
 * @param {string} status should be 'info' 'success' or 'error'
 * @param {string} message The notification to send
 */
const sendNotification = (status, message) => {

    let notifDuration = 7000;

    const mainDiv = document.querySelector('main');
    // Create the notification
    const notifDiv = document.createElement('div');
    // just for if status doesn't exists
    switch(status) {
        case 'info': break;
        case 'success': break;
        case 'error': break;
        default: {
            // Stop and call an error notification ;)
            return sendNotification('error', 'Il y a un problème avec le type de notification !');
        }
    }
    // build visual and animation, type will change background color
    notifDiv.classList.add('notification', status);

    // Include the message
    const notifText = document.createElement('p');
    notifText.classList.add('notif-text');
    notifText.innerText = message;

    // Insert in DOM
    notifDiv.appendChild(notifText);    
    mainDiv.appendChild(notifDiv);

    // will remove notif from DOM in a short time
    const animTimeOut = setTimeout(() => {
        mainDiv.removeChild(notifDiv);
    }, notifDuration + 1000);
    
    // User can pause the animation to have some extra time to read the notification, a second click will remove the notification
    notifDiv.addEventListener('click', (e) => {
        const notif = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        // User needs some time to read
        if (!notif.classList.contains('paused')) {
            // Pause the animation
            notif.classList.add('paused');
            // Prevent to delete notification
            clearTimeout(animTimeOut);
        }
        // User has finished reading
        else {
            // launch a hide animation
            notif.classList.add('hide');
            notif.classList.remove('paused');
            // Remove from DOM jus after animation
            setTimeout(() => {
                mainDiv.removeChild(notif);
            }, 1500);
        }
    });
};