const navButtons = document.querySelectorAll('.nav-header');
const navContents = document.querySelectorAll('.nav-body');

for (let i= 0, len = navButtons.length; i < len; i++) {

    navButtons[i].addEventListener('click', (e) => {

        for (let k= 0, leng = navButtons.length; k < leng; k++) {
            navButtons[k].classList.remove('selected');
        }

        for (let j = 0, max = navContents.length; j < max; j++) {

            navContents[j].classList.add('d-none');

            if (navContents[j].id === navButtons[i].id + '-body') {

                navButtons[i].classList.add('selected');
                navContents[j].classList.remove('d-none');
            }
        }
    });
}