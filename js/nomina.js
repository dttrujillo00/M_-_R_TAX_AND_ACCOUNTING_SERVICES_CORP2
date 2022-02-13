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

/*************************
 * MANEJADOR DE LA TABLA *
 *  **********************/
const bodyTable = document.querySelector('tbody');
let empleados;

let defaultEmployee = {
    name: ''
}


 const htmlEmployees = (employee) => {
     console.log(employee.name);
    let newEmployee = `
    <tr class="nombre revenue">
        <td>
            <img src="../icons/delete.png" class="icon-delete">
            <input type="text" value="${employee.name}" ${employee.name === ''? 'autofocus':'id='}>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
     <tr class="amount">
        <td>Amount</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr class="type">
        <td>Type</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
     </tr>
    `;

    return newEmployee;
 }

///// TRAER EMPLEADOS /////
const renderData = (data) => {
    data.empleados.forEach(empleado => {
        bodyTable.innerHTML += htmlEmployees(empleado);
    });
}

const traerEmpleados = () => {
    fetch('../empleados.json')
    .then(res => res.json())
    .then(data => {
        empleados = data;
        renderData(data);
        manejadorModificarEmpleado();
    })
}


///// CREAR EMPLEADO NUEVO /////
const addEmployeeBtn = document.querySelector('.add-employee');

const addEmployee = () => {
    hideMenu();
    bodyTable.innerHTML += htmlEmployees(defaultEmployee);

}

///// EDITAR EMPLEADOS /////

const manejadorModificarEmpleado = () => {
    const modifyBtn = document.querySelector('.modify-employee');
    const deleteIcons = document.querySelectorAll('main table tr.nombre td img');
    const checkIcon = document.querySelector('.check');
    
    console.log(deleteIcons);

    const changeIntoModify = () => {
        hideMenu();
        checkIcon.style.visibility = 'visible';
    
        deleteIcons.forEach(icon => {
            icon.style.visibility = 'visible';
            icon.addEventListener('click', eliminarEmpleado);
        })
    }

    const changeOutModify = () => {
        checkIcon.style.visibility = 'hidden';
    
        deleteIcons.forEach(icon => {
            icon.style.visibility = 'hidden';
        })
    }

    modifyBtn.addEventListener('click', changeIntoModify);
    checkIcon.addEventListener('click', changeOutModify);
}

/*****************************************
 * MANEJADOR PARA ELIMINAR LOS EMPLEADOS *
 *  **************************************/
 const modal = document.querySelector('.modal');
 const btnAceptar = document.querySelector('.btn-aceptar');
 const btnCancelar = document.querySelector('.btn-cancelar');
 
 const showModal = nombre => {
     modal.children[1].innerText = nombre;
     modal.classList.add('active');
 }
 
 const hideModal = () => {
     modal.classList.remove('active');
 }
 
 btnAceptar.addEventListener('click', hideModal);
 btnCancelar.addEventListener('click', hideModal);

//  *************************************

// FUNCION ELIMINAR EMPRESA
const eliminarEmpleado = (e) => {
    const nombre = e.target.nextSibling.nextSibling.value;
    // const id = e.target.parentElement.id;
    // console.log(e.target.nextSibling.nextSibling.value);
    showModal(nombre);
}
// ***********************************


addEmployeeBtn.addEventListener('click', addEmployee);

traerEmpleados();