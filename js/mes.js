import { showNotification } from './showNotification.js';

/*******************************************************
 * Variables Indispensables para las consultas a la DB *
 * *****************************************************/

 let business_id = localStorage.getItem('id_bussines');
 let year  = localStorage.getItem('actual_year');
 let month = localStorage.getItem('actual_month');
 let bussines = localStorage.getItem('actual_business');

 let operationNameArray = [];


/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
 const iconMenu = document.querySelector('.icon-menu img');
 const menu = document.querySelector('.menu');
 const secondIconMenu = document.querySelector('.menu > img');
 const body = document.querySelector('body');
 const closeMenuElement = document.querySelector('.hide-menu');
 const empresaPage = document.querySelector('.empresa-page');
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
    document.removeEventListener('click', auxiliarHideMenu)
}

const retrocederPage = () => {
    window.location.pathname = 'pages/empresa.html';
}

const retrocederHome = () => {
    window.location.pathname = 'pages/index.html';
} 

iconMenu.addEventListener('click',showMenu);
secondIconMenu.addEventListener('click', hideMenu);
closeMenuElement.addEventListener('click', hideMenu);
empresaPage.addEventListener('click', retrocederPage);
home.addEventListener('click', retrocederHome);



/***********************
 *  AGREGAR OPERACION  *
 *  ********************/
const addOperationBtn = document.querySelector('.add-operation');
const formAgregarOperacion = document.querySelector('.form-agregar-operacion');
const cancelBtn = document.querySelector('.submit-group .btn-cancel');
const saveBtn = document.querySelector('.submit-group .btn-save');
const inputs = formAgregarOperacion.querySelectorAll('.form-group input');
const inputIdAccount = document.querySelector('#id_account');
let readyToSend;

const showForm = (date, operation, amount, edit, id_account) => {
    body.classList.add('opacity');
    formAgregarOperacion.querySelector('form').reset();
    inputs.forEach( input => input.classList.remove('invalid-data'))
    inputs[0].value = date;
    inputs[1].value = operation;
    inputs[2].value = amount;
    inputIdAccount.value = id_account;

    if (edit) {
        formAgregarOperacion.querySelector('.btn-save').classList.add('edit');
    } else {
        formAgregarOperacion.querySelector('.btn-save').classList.remove('edit');
    }

    // inputs[1].addEventListener('input', e => {
    //     operationNameArray.forEach( item => {
    //         // console.log(item.toLowerCase() + ': ' + e.target.value.toLowerCase());
    //         if(e.target.value.toLowerCase() === item.toLowerCase().substring(0, e.target.value.length)) {
                
    //         }
    //     })
    // });

    formAgregarOperacion.classList.add('show');

}

const hideForm = () => {
    body.classList.remove('opacity');
    formAgregarOperacion.classList.remove('show');
}

const addOperation = () => {
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let month = localStorage.getItem('actual_month');

    if(month <10) {
        month = '0' + month;
    }

    if(day <10) {
        day = '0' + day;
    }

    console.log(`${year}-${month}-${day}`);
    hideMenu();
    showForm(`${year}-${month}-${day}`, '', '', false, '');
    formAgregarOperacion.querySelector('#date').focus();
    console.log('Funcion Add operation...');
}

const validate = async(e) => {
    e.preventDefault();

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

        if(e.target.classList.contains('edit')) {      
            console.log('Editar');
            let selector  = document.getElementById('type');
            let is_positive;
            console.log(selector.options[selector.selectedIndex].value);
            
            is_positive = selector.options[selector.selectedIndex].value;

            console.log(business_id + ' ' + inputIdAccount.value + ' ' + date.value + ' ' + is_positive + ' ' + operation.value + ' ' + amount.value);

            const result =await window.ipcRenderer.invoke('editar_cuenta',business_id,inputIdAccount.value,is_positive, date.value,operation.value,amount.value);
            console.log('Operacion editada con exito '+result);
            showNotification();
            await getOperaciones();
            await getTotalOperaciones()

        } else {
            console.log('Agregar');
            let selector  = document.getElementById('type');
            let is_positive;
            console.log(selector.options[selector.selectedIndex].value);
    
            is_positive = selector.options[selector.selectedIndex].value;
            const result =await window.ipcRenderer.invoke('agregar_operacion', date.value,operation.value,amount.value,is_positive,business_id);
            console.log('Operacion agregada con exito '+result);
            showNotification();
            await getOperaciones();
            await getTotalOperaciones()
        }

    }
}

inputs.forEach( input => {
    input.addEventListener('input', e => {
        if(e.target.value !== '') {
            e.target.classList.remove('invalid-data');
        } else {
            e.target.classList.add('invalid-data');
        }
    })
})

addOperationBtn.addEventListener('click', addOperation);
cancelBtn.addEventListener('click', hideForm);
saveBtn.addEventListener('click', validate);

/**********************
 *  EDITAR OPERACION  *
 *  *******************/
function handleEdit() {
    
    const editarBtn = document.querySelectorAll('.editar-operacion');
    const operationList = document.querySelectorAll('.data-table tbody tr')

    editarBtn.forEach((btn, index) => {
        btn.addEventListener('click', async(e) => {

            console.log('Editar Operacion ' + index)
            
            let rowToEdit = operationList[index];
            let date = rowToEdit.querySelector('.date').value;
            console.log(date);
            let operation = rowToEdit.querySelector('.operation').innerText;
            let amount = rowToEdit.querySelector('.amount').innerText;
            let id_editar;

            if(e.target.classList.contains('icon-pencil')) {
                id_editar = e.target.parentElement.parentElement.id;
            } else if(e.target.classList.contains('editar-operacion')) {
                id_editar = e.target.parentElement.id;
            }


            showForm(date, operation, amount.slice(1), true, id_editar);
        });
    });
}

/************************
 *  ELIMINAR OPERACION  *
 *  *********************/
function handleDelete() {
    const eliminarBtn = document.querySelectorAll('.eliminar-operacion');
    const deleteContainer = document.querySelectorAll('.delete-container');
    const cancelDelete = document.querySelectorAll('.cancel-delete');
    const confirmDelete = document.querySelectorAll('.confirm-delete');
    
    eliminarBtn.forEach( (btn, index) => {
        btn.addEventListener('click', () => {
            console.log('Eliminar Operacion');
            
            deleteContainer[index].classList.add('show');
        });
    });

    cancelDelete.forEach( (btn, index) => {
        btn.addEventListener('click', () => {
            deleteContainer[index].classList.remove('show');
        });
    });

    confirmDelete.forEach( (btn, index) => {
        btn.addEventListener('click', async(e) => {
            let id = e.target.parentElement.parentElement.parentElement.id
            const result =await window.ipcRenderer.invoke('eliminar_operacion',id);
            console.log('Operacion eliminada con exito '+result);
            showNotification();
            deleteContainer[index].classList.remove('show');
            await getOperaciones();
            await getTotalOperaciones()
        });
    });
}

/************************
 *      CAMBIAR MES     *
 *  *********************/
const mesesSelect = document.querySelector('select.meses');
const mesTitulo = document.querySelector('.empresa-name-container h1');
const mesesArray = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

mesesSelect.value = month;
mesTitulo.innerText = mesesArray[month - 1];
console.log(mesesArray[month - 1]);

 mesesSelect.addEventListener('change', async(e) => {
     console.log('Fetching the month number: ' + e.target.value); 
     localStorage.setItem('actual_month', e.target.value);
     mesTitulo.innerText = mesesArray[e.target.value - 1];
     await getOperaciones();
     await getTotalOperaciones()
 });


/*************************
 *  OBTENER OPERACIONES  *
 *  **********************/
const bodyDataTable = document.querySelector('main .data-table tbody');
const bodyTotalTable = document.querySelector('.total-table table tbody');

const createHTMLOperation = (date, operation, amount, id, is_positive) => {
    let element = `
        <tr id="${id}">
            <td>
                <input type="date" name="fecha" id="" value="${date}" class="date" disabled>
                <div class="delete-container">
                    <p>You want to delete this operation?</p>
                    <button class="confirm-delete">Delete</button>
                    <button class="cancel-delete">Cancel</button>
                </div>
            </td>
            <td class="operation">${operation}</td>
            <td class="amount ${is_positive ? 'positivo' : 'negativo'}">$${amount}</td>
            <td class="editar-operacion"><span class="icon-pencil"></span></td>
            <td class="eliminar-operacion"><span class="icon-trash"></span></td>
        </tr>
    `;

    return element;
}

const renderOperaciones = (Operaciones) => {
    const emptybodyDataTable  = ``;
    bodyDataTable.innerHTML = emptybodyDataTable ;
    Operaciones.forEach( (operacion,index) => {
        let mes= operacion.month;
        let day= operacion.day;
        if (operacion.month< 10){
             mes= '0'+operacion.month;
        }
        if (operacion.day< 10){
             day= '0'+operacion.day;
        }
        
        let date = operacion.year+'-'+mes+'-'+day
        bodyDataTable.innerHTML += createHTMLOperation(date, operacion.field,operacion.amount, operacion.account_id, operacion.is_positive);
    });
}



const getOperaciones =async () => {
    await window.ipcRenderer.invoke('obtener_cuentas_por_anno',bussines,localStorage.getItem('actual_month'), year).then((result) => {
        console.log("Se obtuvieron las operaciones del año "+year);
        console.log(result);
        renderOperaciones(result);
        handleEdit();
        handleDelete();
    })
}


/****************************************
 * Tabla del total de las operaciones   *
 *                                      *
 * ****************************************/

 const createHTMLTotalOperation = (operation, total) => {
    let element = `
        <tr>
            <td>${operation}</td>
            <td>$${total}</td>
        </tr>
    `;

    return element;
}



const renderTotalOperaciones = (Operaciones) => {
    const emptybodyDataTable  = ``;
    operationNameArray = [];
    bodyTotalTable.innerHTML = emptybodyDataTable;
    Operaciones.forEach( (operacion,index) => {
        // console.log(operacion);
        operationNameArray.push(operacion.Field);
        bodyTotalTable.innerHTML += createHTMLTotalOperation(operacion.Field, operacion.YDT);
    });
}


const getTotalOperaciones =async () => {
    await window.ipcRenderer.invoke('obtener_campos_por_mes',bussines,year, localStorage.getItem('actual_month')).then((result) => {
        console.log("Se obtuvo el total de cada operacion del mes "+localStorage.getItem('actual_month'));
        console.log(result);
        renderTotalOperaciones(result);

    })
}





const yearSpan = document.querySelector('span.year');

yearSpan.innerText = localStorage.getItem('actual_year');

(async function init() {
    console.log("Inicio y pido los datos");
	await getOperaciones();
    await getTotalOperaciones()

})();

// setTimeout(() => {
//     document.querySelector('.notification').classList.remove('hide');
//     document.querySelector('.notification').classList.add('show');
// }, 4000);

// setTimeout(() => {
//     document.querySelector('.notification').classList.remove('show');
//     document.querySelector('.notification').classList.add('hide');
// }, 7000);