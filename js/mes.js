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
const addOperationBtn = document.querySelector('.add-operation2');
const formAgregarOperacion = document.querySelector('.form-agregar-operacion');
const cancelBtn = document.querySelector('.submit-group .btn-cancel');
const saveBtn = document.querySelector('.submit-group .btn-save');

const showForm = () => {
    formAgregarOperacion.querySelector('form').reset();
    formAgregarOperacion.classList.add('show');
}

const hideForm = () => {
    formAgregarOperacion.classList.remove('show');
}

const addOperation = () => {
    hideMenu();
    showForm();
    formAgregarOperacion.querySelector('#date').focus();
    console.log('Funcion Add operation...');
}

const guardarOperacion = (e) => {
    e.preventDefault();
    hideForm();
    console.log('Guardando operacion...')
}

addOperationBtn.addEventListener('click', addOperation);
cancelBtn.addEventListener('click', hideForm);
saveBtn.addEventListener('click', guardarOperacion);

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
 const eliminarBtn = document.querySelectorAll('.eliminar-operacion');
 const deleteContainer = document.querySelectorAll('.delete-container');
 const cancelDelete = document.querySelectorAll('.cancel-delete');
 const confirmDelete = document.querySelectorAll('.confirm-delete');
 
eliminarBtn.forEach( (btn, index) => {
    console.log(index);
    btn.addEventListener('click', () => {
        console.log('Eliminar Operacion')

        deleteContainer[index].classList.add('show');
    });
});

cancelDelete.forEach( (btn, index) => {
    btn.addEventListener('click', () => {
        deleteContainer[index].classList.remove('show');
    });
});