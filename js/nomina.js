let month = localStorage.getItem('actual_month');

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
 const select = formAgregarOperacion.querySelector('.form-group select');
 let readyToSend;

 const showForm = (date, name, amount, type, edit) => {
    body.classList.add('opacity');
    formAgregarOperacion.querySelector('form').reset();
    inputs.forEach( input => input.classList.remove('invalid-data'))
    inputs[0].value = date;
    inputs[1].value = name;
    inputs[2].value = amount;

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

const addOperation = () => {
    hideMenu();
    showForm('', '', '', '', false);
    formAgregarOperacion.querySelector('#date').focus();
    console.log('Funcion Add operation...');
}

const validate = (e) => {
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
            console.log('Editar');
        } else {
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
const editarBtn = document.querySelectorAll('.editar-operacion');
const operationList = document.querySelectorAll('.employee-table tbody tr');

editarBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        console.log('Editar Operacion ' + index)
        
        let rowToEdit = operationList[index];
        console.log(rowToEdit);
        let date = rowToEdit.querySelector('.date').value;
        console.log(date);
        let name = rowToEdit.querySelector('.employee-name').innerText;
        console.log(name);
        let amount = rowToEdit.querySelector('.amount').innerText;
        console.log(amount.slice(1));
        let type = rowToEdit.querySelector('.type').innerText;
        console.log(type);

        showForm(date, name, amount.slice(1), type, true);
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

/************************
 *      CAMBIAR MES     *
 *  *********************/
const meses = document.querySelector('select.meses');

meses.value = month

meses.addEventListener('change', e => {
    console.log('Fetching the month number: ' + e.target.value);
    localStorage.setItem('actual_month', e.target.value);
});

/************************
 *  EXPORT EMPLOYEE     *
 *  *********************/
const createExcelFile = (table_elt) => {

    // Extract Data (create a workbook object from the table)
    var workbook = XLSX.utils.table_to_book(table_elt);

    // Process Data (add a new row)
    var ws = workbook.Sheets["Sheet1"];
    // XLSX.utils.sheet_add_aoa(ws, [["Exported from M&R app "+new Date().toISOString()]], {origin:-1});

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, "Reporte.xlsb");
}

const btnExport = document.querySelectorAll('.export-icon');

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

            // if (i > 1  && el.classList.contains('head-tr')) {
            //     console.log('Termina aqui');
            //     continuarLoop = false;
            //     continue;
            // } else {
            //     let nodoNuevoCopia = el.cloneNode(true);
            //     console.log(nodoNuevoCopia, 'Copia');
            //     excelBodyTable.appendChild(nodoNuevoCopia);
            //     // console.log('Continua')
            // }

            console.log(i + '. ' , el);
            el = el.nextSibling;
            i++;
        }

        excelTable.appendChild(excelBodyTable);
        console.log(excelTable);
        createExcelFile(excelTable);
    })
})

/*************************
 *  OBTENER OPERACIONES  *
 *  **********************/
const bodyEmployeeTable = document.querySelector('.employee-table table tbody');
const bodyEmployeeDetail = document.querySelector('.employee-details table tbody')

const createHTMLOperation = (date, name, amount, type) => {
    let typeConverted;
    if(type === 0){
        typeConverted = 'ATM';
    } else if(type === 1) {
        typeConverted = 'CASH';
    } else {
        typeConverted = 'TRANSF'
    }

    let element = `
        <tr>
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

const createHTMLEmployeeDetail = (name, atm, cash, transf) => {
    let element = `
    <tr>
        <td colspan="2" style="text-align: center;">${name}<img src="../icons/export.png" title="Export" alt="Export-icon" class="export-icon"></td>
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

const yearSpan = document.querySelector('span.year');

yearSpan.innerText = localStorage.getItem('actual_year');