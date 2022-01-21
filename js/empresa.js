/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
 const iconMenu = document.querySelector('.icon-menu img');
 const menu = document.querySelector('.menu');
 const secondIconMenu = document.querySelector('.menu > img');
 const body = document.querySelector('body');
 const closeMenuElement = document.querySelector('.hide-menu');
 const home = document.querySelector('.home');

 const auxiliarHideMenu = (e) => {
    if(e.target === body){
        hideMenu();
    }
}

const showMenu = () => {
    body.classList.add('opacity');
    menu.classList.add('active');
    setTimeout(() => {
        secondIconMenu.classList.add('active');
    }, 300)

    document.addEventListener('click', auxiliarHideMenu)
}

const hideMenu = () => {
    body.classList.remove('opacity');
    menu.classList.remove('active');
    secondIconMenu.classList.remove('active');
    archivoContent.classList.remove('active');
    document.removeEventListener('click', auxiliarHideMenu)
}

const retrocederHome = () => {
    window.location.pathname = 'pages/index.html';
}

iconMenu.addEventListener('click',showMenu);
secondIconMenu.addEventListener('click', hideMenu);
closeMenuElement.addEventListener('click', hideMenu);
home.addEventListener('click', retrocederHome);

/*******************************************************
 * MANEJADOR PARA POSICIONAR LAS TARJETAS DE LOS MESES *
 *  ****************************************************/

 const navegacionEmpresa = () => {
    window.location.pathname = '/pages/empresa.html';
}

const posicionarTarjetasMeses = () => {
    const meses = document.querySelectorAll('.mes');
    const filasMeses= document.querySelectorAll('.fila-mes');
    
    let index = 80;
    let count = 1;
    
    filasMeses.forEach( (fila, index) => {
        fila.style.bottom = `${-35*(index + 1)}px`;
    });
    
    // POSICIONAR TARJETAS POR CAPAS
    meses.forEach((mes) => {
        mes.style.zIndex = index;
        index--;
        mes.addEventListener('click', navegacionEmpresa);
    });
    
    meses.forEach((mes, index) => {
    
        if(index%7 !== 0){
        mes.style.transform = `translate(${-10*count}%)`;
        count++;
        } else {
            count = 1;
        }
    });
}

document.addEventListener('DOMContentLoaded', e => {
    posicionarTarjetasMeses();
})