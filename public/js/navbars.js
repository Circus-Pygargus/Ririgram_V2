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
                        }
                        else {
                            navButtons[i].classList.add('selected');
                            navSubContents[j].classList.remove('d-none');
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
                        }
                        else {
                            navButtons[i].classList.add('selected');
                            navContents[j].classList.remove('d-none');
                        }
                    }
                }
            }
        });
    }
};