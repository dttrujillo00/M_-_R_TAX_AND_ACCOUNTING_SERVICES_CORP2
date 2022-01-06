/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
const iconMenu = document.querySelector('.icon-menu img');
const menu = document.querySelector('.menu');
const secondIconMenu = document.querySelector('.menu > img');
const body = document.querySelector('body');
const closeMenuElement = document.querySelector('.hide-menu');
const liArchivo = document.querySelector('.li-archivo');
const archivoContent = document.querySelector('.archivo-content');

const showMenu = () => {
    body.classList.add('opacity');
    menu.classList.add('active');
    setTimeout(() => {
        secondIconMenu.classList.add('active');
    }, 300)
}

const hideMenu = () => {
    body.classList.remove('opacity');
    menu.classList.remove('active');
    secondIconMenu.classList.remove('active');
    archivoContent.classList.remove('active');
}

const showArchivo = () => {
    archivoContent.classList.toggle('active');
    // console.log(liArchivo);
}

iconMenu.addEventListener('click',showMenu);
secondIconMenu.addEventListener('click', hideMenu);
closeMenuElement.addEventListener('click', hideMenu);
liArchivo.addEventListener('click', showArchivo);

/************************************************************
 * MANEJADOR DEL POSICIONAMIENTO DE LAS TARJETAS DE EMPRESA *
 *  *********************************************************/
const empresas = document.querySelectorAll('.empresa');

let index = 80;

// POSICIONAR TARJETAS
empresas.forEach((empresa) => {
    empresa.style.zIndex = index;
    index--;
});

empresas.forEach((empresa, index) => {
    empresa.style.transform = `translate(${-20*(index + 1)}px)`;
    // console.log(empresa, index);
});
