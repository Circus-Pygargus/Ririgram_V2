// This is for nav bars (user logged or not)
const watchNavButtons = () => {

    let navButtons = document.querySelectorAll('.nav-header');
    let navSubButtons = document.querySelectorAll('.nav-header.sub-header');
    let navContents = document.querySelectorAll('.nav-body');
    let navSubContents = document.querySelectorAll('.nav-body.sub-body');

    for (let i= 0, len = navButtons.length; i < len; i++) {

        navButtons[i].addEventListener('click', (e) => {

            const isSelected = navButtons[i].classList.contains('selected');

            if (navButtons[i].classList.contains('sub-header')) {
                for (let k= 0, leng = navSubButtons.length; k < leng; k++) {
                    navSubButtons[k].classList.remove('selected');
                }

                for (let j = 0, max = navSubContents.length; j < max; j++) {
    
                    navSubContents[j].classList.add('d-none');
    
                    if (navSubContents[j].id === navButtons[i].id + '-body') {
    
                        if (isSelected) {
                            navButtons[i].classList.remove('selected');
                            // ?? A remettre après ajout en scss d'une anim ?
                            // navButtons[i].scrollIntoView({
                            //     behavior: 'smooth'
                            // });
                        }
                        else {
                            navButtons[i].classList.add('selected');
                            navSubContents[j].classList.remove('d-none');
                            navButtons[i].scrollIntoView({
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }
            else {
                for (let k= 0, leng = navButtons.length; k < leng; k++) {
                    navButtons[k].classList.remove('selected');
                }

                for (let j = 0, max = navContents.length; j < max; j++) {
    
                    navContents[j].classList.add('d-none');
    
                    if (navContents[j].id === navButtons[i].id + '-body') {
    
                        if (isSelected) {
                        navButtons[i].classList.remove('selected');
                        // navButtons[i].scrollIntoView({
                        //     behavior: 'smooth'
                        // });
                        }
                        else {
                            navButtons[i].classList.add('selected');
                            navContents[j].classList.remove('d-none');
                            navButtons[i].scrollIntoView({
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }
        });
    }
};


// This will reset the navbar as is was when received by browser
const cleanNavbar = () => {
    const navHeaders = document.querySelectorAll('.nav-header');
    const navBodies = document.querySelectorAll('.nav-body');

    navHeaders.forEach((navHeader) => {
        navHeader.classList.remove('selected');
    });

    navBodies.forEach((navBody) => {
        navBody.classList.add('d-none');
    });

}