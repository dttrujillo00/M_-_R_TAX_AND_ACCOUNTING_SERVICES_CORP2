import { createExcelFile } from './createExcel.js';
import { showNotification } from './showNotification.js';

let business_id      = localStorage.getItem('id_bussines');
let storage_year     = localStorage.getItem('actual_year');
let month            = localStorage.getItem('actual_month');
let bussines         = localStorage.getItem('actual_business');

let nominas;

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
    // window.location.pathname = 'pages/empresa.html';
    window.ipcRenderer.send('navegacion', 'pages/empresa.html');
}

const retrocederHome = () => {
    // window.location.pathname = 'pages/index.html';
    window.ipcRenderer.send('navegacion', 'pages/index.html');
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
 const select = formAgregarOperacion.querySelector('.form-group select');
 const inputIdAccount = document.querySelector('#id_account');
 let readyToSend;

 const showForm = (date, name, amount, type, edit, id_editar) => {
    body.classList.add('opacity');
    formAgregarOperacion.querySelector('form').reset();
    inputs.forEach( input => input.classList.remove('invalid-data'))
    inputs[0].value = date;
    inputs[1].value = name;
    inputs[2].value = amount;
    inputIdAccount.value = id_editar;


    if(type === 'ATM'){
        select.value = 0;
    } else if(type === 'CASH') {
        select.value = 1;
    } else {
        select.value = 2
    }

    if (edit) {
        formAgregarOperacion.querySelector('.btn-save').classList.add('edit');
    } else {
        formAgregarOperacion.querySelector('.btn-save').classList.remove('edit');
    }

    formAgregarOperacion.classList.add('show');
}

const hideForm = () => {
    body.classList.remove('opacity');
    formAgregarOperacion.classList.remove('show');
}

const addOperation = async() => {

    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let month = localStorage.getItem('actual_month');

    if(month <10) {
        month = '0' + month;
    }

    if(day <10) {
        day = '0' + day;
    }


    hideMenu();
    showForm(`${year}-${month}-${day}`, '', '', '', false);
    formAgregarOperacion.querySelector('#date').focus();
    console.log('Funcion Add operation...');  
}

const validate = async(e) => {
    e.preventDefault()

    readyToSend = 0

    if(select.value === '') {
        select.classList.add('invalid-data');
        select.focus();
    } else {
        select.classList.remove('invalid-data');
        readyToSend++;
    }

    for (let index = inputs.length - 1; index >= 0; index--) {
        if(inputs[index].value === '') {
            inputs[index].classList.add('invalid-data');
            inputs[index].focus();
        } else {
            inputs[index].classList.remove('invalid-data');
            readyToSend++;
        }
        
    }

    if(readyToSend === inputs.length + 1) {
        hideForm();
        console.log('Saving Data...');
        /********************************************************
         *  FUNCION PARA GUARDAR OPERACION EN LA DB             *
         *  Y LUEGO EJECUTAR LA FUNCION DE OBTENER OPERACIONES  *
         *  *****************************************************/
        if (e.target.classList.contains('edit')) {
            let newDate = inputs[0].value;
            let newName = inputs[1].value;
            let newAmount = inputs[2].value;
            let idToEdit = inputIdAccount.value;
            console.log(idToEdit)

            // amount,date,p_type,name, business_id,payroll_id

            let selector  = document.getElementById('type');
            let p_type = selector.options[selector.selectedIndex].value;
            console.log('Esta es la fecha', newDate, typeof(newDate))
            await update_payroll(newAmount, newDate, p_type, newName, business_id, idToEdit)
            await get_payroll(business_id, storage_year, month);
            console.log('Editar');
        } else {
            let selector  = document.getElementById('type');
            let p_type = selector.options[selector.selectedIndex].value;
            console.log(inputs[2].value,p_type,inputs[1].value,business_id,inputs[0].value);
            await insert_payroll(inputs[2].value,p_type,inputs[1].value,business_id,inputs[0].value);
            await get_payroll(business_id, storage_year, month);
            console.log('Agregar');
        }
    }
}

addOperationBtn.addEventListener('click', addOperation);
cancelBtn.addEventListener('click', hideForm);
saveBtn.addEventListener('click', validate);

/**********************
 *  EDITAR OPERACION  *
 *  *******************/
function handleEdit() {
    const editarBtn = document.querySelectorAll('.editar-operacion');
    const operationList = document.querySelectorAll('.employee-table tbody tr');
    
    editarBtn.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            console.log('Editar Operacion ' + index)
            
            const rowToEdit = operationList[index];
            console.log(rowToEdit);
            const date = rowToEdit.querySelector('.date').value;
            console.log(date);
            const name = rowToEdit.querySelector('.employee-name').innerText;
            console.log(name);
            const amount = rowToEdit.querySelector('.amount').innerText;
            console.log(amount.slice(1));
            const type = rowToEdit.querySelector('.type').innerText;
            console.log(type);

            let id_editar;

            if(e.target.classList.contains('icon-pencil')) {
                id_editar = e.target.parentElement.parentElement.id;
            } else if(e.target.classList.contains('editar-operacion')) {
                id_editar = e.target.parentElement.id;
            }

    
            showForm(date, name, amount.slice(1), type, true, id_editar);
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
            console.log('Eliminar Operacion')
            deleteContainer[index].classList.add('show');
        });
    });
    
    confirmDelete.forEach( (btn, index) => {
        btn.addEventListener('click', async(e) => {
            let id = e.target.parentElement.parentElement.parentElement.id
            await delete_payroll(id)
            showNotification();
            deleteContainer[index].classList.remove('show');
            await get_payroll(business_id, storage_year, month)
        });
    });
    
    
    cancelDelete.forEach( (btn, index) => {
        btn.addEventListener('click', () => {
            deleteContainer[index].classList.remove('show');
        });
    });
}

/************************
 *      CAMBIAR MES     *
 *  *********************/
const meses = document.querySelector('select.meses');

meses.value = month

meses.addEventListener('change', async(e) => {
    console.log('Fetching the month number: ' + e.target.value);
    localStorage.setItem('actual_month', e.target.value);
    await get_payroll(business_id, storage_year, localStorage.getItem('actual_month', e.target.value))
});

/************************
 *  EXPORT EMPLOYEE     *
 *  *********************/

function handelExport() {
    // console.log(document.evaluate('/html/body/main/div/div[2]/table/tbody/tr[1]/td/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
    // const tabla = document.evaluate('/html/body/main/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    const btnExport = document.querySelectorAll('img.export-icon');
    console.log(btnExport);
    // console.log(document.querySelector('.employee-details table tbody'));
    
    btnExport.forEach( btn => {
        btn.addEventListener('click', e => {
    
            let excelTable = document.createElement('table');
            let excelBodyTable = document.createElement('body');
    
            // console.log('Exporting ' , e.target.parentElement.parentElement);
            let el = e.target.parentElement.parentElement;
            let i = 1;
            let continuarLoop = true;
            let elCopy;
    
            while (continuarLoop && i < 7) {
                if (el.nodeName === '#text') {
                    el = el.nextSibling;
                    i++;
                }
    
                let nodoNuevoCopia = el.cloneNode(true);
                console.log(nodoNuevoCopia, 'Copia');
                excelBodyTable.appendChild(nodoNuevoCopia);
    
                console.log(i + '. ' , el);
                el = el.nextSibling;
                i++;
            }
    
            excelTable.appendChild(excelBodyTable);
            console.log(excelTable);
            createExcelFile(excelTable);
        })
    })
}


/*************************
 *  OBTENER OPERACIONES  *
 *  **********************/
const bodyEmployeeTable = document.querySelector('.employee-table table tbody');
const bodyEmployeeDetail = document.querySelector('.employee-details table tbody')

const createHTMLOperation = (date, name, amount, type, id) => {
    let typeConverted;
    if(type === '0'){
        typeConverted = 'ATM';
    } else if(type === '1') {
        typeConverted = 'CASH';
    } else {
        typeConverted = 'TRANSF'
    }

    let element = `
        <tr id="${id}">
            <td>
                <input type="date" name="fecha" id="date" value="${date}" class="date" disabled>
                <div class="delete-container">
                    <p>You want to delete this record?</p>
                    <button class="confirm-delete">Delete</button>
                    <button class="cancel-delete">Cancel</button>
                </div>
            </td>
            <td class="employee-name" title="See details">${name}</td>
            <td class="amount">$${amount}</td>
            <td class="type">${typeConverted}</td>
            <td class="editar-operacion"><span class="icon-pencil"></span></td>
            <td class="eliminar-operacion"><span class="icon-trash"></span></td>
        </tr>
    `;

    return element;
}

const createHTMLEmployeeDetail = (result, employee_name) => {

    let atm = 0
    let cash = 0
    let transf = 0;

    result.forEach( ({payment_type, amount}) => {
        if(payment_type === '0') {
            atm = amount;
        } else if(payment_type === '1') {
            cash = amount;
        } else {
            transf = amount;
        }
    })
    
    let element = `
    <tr class="head-tr">
        <td colspan="2" style="text-align: center;">${employee_name}<img src="../icons/export.png" title="Export" alt="Export-icon" class="export-icon"></td>
    </tr>
    <tr>
        <td>Total ATM</td>
        <td>$${atm}</td>
    </tr>
    <tr>
        <td>Total CASH</td>
        <td>$${cash}</td>
    </tr>
    <tr>
        <td>Total TRANSF</td>
        <td>$${transf}</td>
     </tr>
    `;

    return element;
}

const renderPayroll = (payrolls) => {
    console.log(payrolls)
    const emptybodyDataTable = ``;
    bodyEmployeeTable.innerHTML = emptybodyDataTable;

    payrolls.forEach( payroll => {
        let mes= payroll.month;
        let day= payroll.day;
        if (payroll.month< 10){
             mes= '0'+payroll.month;
        }
        if (payroll.day< 10){
             day= '0'+payroll.day;
        }
        
        let date = payroll.year+'-'+mes+'-'+day;
        bodyEmployeeTable.innerHTML += createHTMLOperation(date, payroll.employee_name, payroll.amount, payroll.payment_type, payroll.payroll_id)
    });
}

const renderEmployee = data => {
    const emptybodyDataTable = ``;
    let nameRegister = [];

    bodyEmployeeDetail.innerHTML = emptybodyDataTable;
    data.forEach( async({business_id, year, employee_name}) => {
        const found = nameRegister.find( element => element === employee_name);
        
        if(found === undefined) {
            nameRegister.push(employee_name);
            await get_payroll_second_table(business_id, year, employee_name, month);
        }
    })

    setTimeout(() => {
        handelExport();
        
    }, 500);

}

const handleSecondTable = (data) => {

    let arrayToSecondTable = data.map(({employee_name}) => {
        return ({
            business_id,
            year: storage_year,
            employee_name
        })
    });

    // console.log(arrayToSecondTable);
    renderEmployee(arrayToSecondTable);
}


const yearSpan = document.querySelector('span.year');

yearSpan.innerText = localStorage.getItem('actual_year');











// -----------------------------CONSULTAS A LA DB------------------------------------------------

async function insert_payroll(amount,p_type,name,bussines_id,date) {
    await window.ipcRenderer.invoke('insert_payroll', amount,p_type,name,bussines_id,date).then((result) => {
        console.log("Se inserto un nuevo payroll");
        console.log(result);
    })
}

async function get_payroll(business_id,year, month) {
    await window.ipcRenderer.invoke('get_payroll',business_id,year, month).then((result) => {
        console.log("Se obtuvo los payroll");
        // console.log(result);
        renderPayroll(result);
        handleDelete();
        handleEdit();
        handleSecondTable([...result]);
    })
}


async function update_payroll( amount,date,p_type,name,bussines_id,payroll_id) {
    await window.ipcRenderer.invoke('update_payroll', amount,date,p_type,name,business_id,payroll_id).then((result) => {
        console.log("Se edito un  payroll");
        console.log(result);
    })
}

async function delete_payroll(id) {
    await window.ipcRenderer.invoke('delete_payroll', id).then((result) => {
        console.log("Se elimino un  payroll");
        console.log(result);
    })
}


async function get_payroll_second_table(business_id,year,employee_name, month) {
    await window.ipcRenderer.invoke('get_all_p_type_by_payroll', business_id,year,employee_name, month).then((result) => {
        // console.log("Se obtuvo lo daros de la segunda tabla");
        // console.log(result);
        bodyEmployeeDetail.innerHTML += createHTMLEmployeeDetail(result, employee_name);
    })
}

(async function init() {
    console.log("Inicio y pido los datos");
	await get_payroll(business_id, storage_year, month)
    // await get_payroll_second_table()

})();