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
const filasEmpresas = document.querySelectorAll('.fila-empresas');
const empresas = document.querySelectorAll('.empresa');

let index = 80;
count = 1;

filasEmpresas.forEach( (fila, index) => {
    fila.style.bottom = `${-35*(index + 1)}px`;
});

// POSICIONAR TARJETAS
empresas.forEach((empresa) => {
    empresa.style.zIndex = index;
    index--;
});

empresas.forEach((empresa, index) => {

    if(index%11 !== 0){
    empresa.style.transform = `translate(${-10*count}%)`;
    count++;
    // console.log(empresa, index);
    } else {
        count = 1;
    }
});

/*****************************************
 * MANEJADOR PARA MODIFICAR LAS EMPRESAS *
 *  **************************************/
const liModificar = document.querySelector('.modificar-empresas');
const checkIcon = document.querySelector('.check');
const iconDeleteList = document.querySelectorAll('.empresa img');

const changeIntoModify = () => {
    hideMenu();
    checkIcon.style.visibility = 'visible';
    iconDeleteList.forEach(icon => {
        icon.style.visibility = 'visible';
    })
}

const changeOutModify = () => {
    checkIcon.style.visibility = 'hidden';
    iconDeleteList.forEach(icon => {
        icon.style.visibility = 'hidden';
    })
}

liModificar.addEventListener('click', changeIntoModify);
checkIcon.addEventListener('click', changeOutModify);