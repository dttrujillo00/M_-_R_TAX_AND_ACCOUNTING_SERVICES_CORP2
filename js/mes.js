/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
 const iconMenu = document.querySelector('.icon-menu img');
 const menu = document.querySelector('.menu');
 const secondIconMenu = document.querySelector('.menu > img');
 const body = document.querySelector('body');
 const closeMenuElement = document.querySelector('.hide-menu');
 const empresaPage = document.querySelector('.empresa-page');

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
    document.removeEventListener('click', auxiliarHideMenu)
}

const retrocederPage = () => {
    window.location.pathname = 'pages/empresa.html';
}

iconMenu.addEventListener('click',showMenu);
secondIconMenu.addEventListener('click', hideMenu);
closeMenuElement.addEventListener('click', hideMenu);
empresaPage.addEventListener('click', retrocederPage);

/***********************
 *  AGREGAR OPERACION  *
 *  ********************/
const addRevenueBtn = document.querySelector('.add-revenue');
const addExpenseBtn = document.querySelector('.add-expense');

const addRevenue = () => {
    console.log('Funcion Revenue');
}

const addExpense = () => {
    console.log('Funcion Expense');
}

addRevenueBtn.addEventListener('click', addRevenue);
addExpenseBtn.addEventListener('click', addExpense);

/**********************
 *  EDITAR OPERACION  *
 *  *******************/
const editarBtn = document.querySelector('.editar-operacion');

const editarOperacion = () => {
    console.log('Editar Operacion')
}

editarBtn.addEventListener('click', editarOperacion)

/************************
 *  ELIMINAR OPERACION  *
 *  *********************/
 const eliminarBtn = document.querySelector('.eliminar-operacion');

 const eliminarOperacion = () => {
     console.log('Eliminar Operacion')
 }
 
 eliminarBtn.addEventListener('click', eliminarOperacion)