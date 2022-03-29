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
const addOperationBtn = document.querySelector('.add-operation');
const formAgregarOperacion = document.querySelector('.form-agregar-operacion');
const cancelBtn = document.querySelector('.submit-group .btn-cancel');
const saveBtn = document.querySelector('.submit-group .btn-save');
const inputs = formAgregarOperacion.querySelectorAll('.form-group input');
let readyToSend;

const showForm = (date, operation, amount) => {
    formAgregarOperacion.querySelector('form').reset();
    inputs.forEach( input => input.classList.remove('invalid-data'))
    inputs[0].value = date;
    inputs[1].value = operation;
    inputs[2].value = amount;
    formAgregarOperacion.classList.add('show');
}

const hideForm = () => {
    formAgregarOperacion.classList.remove('show');
}

const addOperation = () => {
    hideMenu();
    showForm('', '', '');
    formAgregarOperacion.querySelector('#date').focus();
    console.log('Funcion Add operation...');
}

const validate = (e) => {
    e.preventDefault()

    readyToSend = 0
    for (let index = inputs.length - 1; index >= 0; index--) {
        if(inputs[index].value === '') {
            inputs[index].classList.add('invalid-data');
            inputs[index].focus();
        } else {
            inputs[index].classList.remove('invalid-data');
            readyToSend++;
        }
        
    }

    if(readyToSend === inputs.length) {
        hideForm();
        console.log('Saving Data...');
        /********************************************************
         *  FUNCION PARA GUARDAR OPERACION EN LA DB             *
         *  Y LUEGO EJECUTAR LA FUNCION DE OBTENER OPERACIONES  *
         *  *****************************************************/
    }
}

addOperationBtn.addEventListener('click', addOperation);
cancelBtn.addEventListener('click', hideForm);
saveBtn.addEventListener('click', validate)

/**********************
 *  EDITAR OPERACION  *
 *  *******************/
const editarBtn = document.querySelectorAll('.editar-operacion');
const operationList = document.querySelectorAll('.data-table tbody tr')

editarBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        console.log('Editar Operacion ' + index)
        
        let rowToEdit = operationList[index];
        let date = rowToEdit.querySelector('.date').value;
        console.log(date);
        let operation = rowToEdit.querySelector('.operation').innerText;
        console.log(operation);
        let amount = rowToEdit.querySelector('.amount').innerHTML;
        console.log(amount.slice(1));

        showForm(date, operation, amount.slice(1));
    });
});

/************************
 *  ELIMINAR OPERACION  *
 *  *********************/
 const eliminarBtn = document.querySelectorAll('.eliminar-operacion');
 const deleteContainer = document.querySelectorAll('.delete-container');
 const cancelDelete = document.querySelectorAll('.cancel-delete');
 const confirmDelete = document.querySelectorAll('.confirm-delete');
 
eliminarBtn.forEach( (btn, index) => {
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

/*************************
 *  OBTENER OPERACIONES  *
 *  **********************/
const bodyDataTable = document.querySelector('main .data-table tbody');

const createHTMLOperation = (date, operation, amount) => {
    let element = `
        <tr>
            <td>
                <input type="date" name="fecha" id="" value="${date}" class="date" disabled>
                <div class="delete-container">
                    <p>You want to delete this operation?</p>
                    <button class="confirm-delete">Delete</button>
                    <button class="cancel-delete">Cancel</button>
                </div>
            </td>
            <td class="operation">${operation}</td>
            <td class="amount">$${amount}</td>
            <td class="editar-operacion"><span class="icon-pencil"></span></td>
            <td class="eliminar-operacion"><span class="icon-trash"></span></td>
        </tr>
    `;

    return element;
}