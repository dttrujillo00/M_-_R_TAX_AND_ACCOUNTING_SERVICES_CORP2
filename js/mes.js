/*******************************************************
 * Variables Indispensables para las consultas a la DB *
 * *****************************************************/
 let business_id = 76;
 let year  = 2022;
 let month = "1" ;
 let bussines = "DamasSoft";






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

const showForm = (date, operation, amount, edit) => {
    body.classList.add('opacity');
    formAgregarOperacion.querySelector('form').reset();
    inputs.forEach( input => input.classList.remove('invalid-data'))
    inputs[0].value = date;
    inputs[1].value = operation;
    inputs[2].value = amount;

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
    showForm('', '', '', false);
    formAgregarOperacion.querySelector('#date').focus();
    console.log('Funcion Add operation...');
}

const validate = async(e) => {
    e.preventDefault()
    console.log(e.target);

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
        } else {
            console.log('Agregar');
            let selector  = document.getElementById('type');
            let is_positive;
            console.log(selector.options[selector.selectedIndex].value);
            
            // if (selector.options[selector.selectedIndex].value === 'false') {
            //     is_positive = false;
            // } else {
            //     is_positive = true
            // }
    
            is_positive = selector.options[selector.selectedIndex].value;
            const result =await window.ipcRenderer.invoke('agregar_operacion', date.value,operation.value,amount.value,is_positive,business_id);
            console.log('Operacion agregada con exito '+result);
            await getOperaciones();
        }

    }
}

inputs.forEach( input => {
    input.addEventListener('input', e => {
        console.log(e.target.value);
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
        let amount = rowToEdit.querySelector('.amount').innerText;
        console.log(amount.slice(1));

        showForm(date, operation, amount.slice(1), true);
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
    btn.addEventListener('click', async() => {
        const result =await window.ipcRenderer.invoke('eliminar_operacion',index);
        console.log('Operacion eliminada con exito '+result);
        deleteContainer[index].classList.remove('show');
    });
});


/************************
 *      CAMBIAR MES     *
 *  *********************/
 const meses = document.querySelector('select.meses');

 meses.addEventListener('change', e => {
     console.log('Fetching the month number: ' + e.target.value);
 });


/*************************
 *  OBTENER OPERACIONES  *
 *  **********************/
const bodyDataTable = document.querySelector('main .data-table tbody');
const bodyTotalTable = document.querySelector('.total-table table tbody');

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

const renderOperaciones = (Operaciones) => {
    const emptybodyDataTable  = ``;
    bodyDataTable .innerHTML = emptybodyDataTable ;
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
        bodyDataTable.innerHTML += createHTMLOperation(date, operacion.field,operacion.amount);
    });
}



const createHTMLTotalOperation = (operation, total) => {
    let element = `
        <tr>
            <td>${operation}</td>
            <td>$${total}</td>
        </tr>
    `;

    return element;
}

const getOperaciones =async () => {
    await window.ipcRenderer.invoke('obtener_cuentas_por_anno',bussines,month, year).then((result) => {
        console.log("Se obtuvieron las operaciones del año "+year);
        console.log(result);
        renderOperaciones(result);
    })
}


(async function init() {
    console.log("Inicio y pido los datos");
	// await getOperaciones();
})();