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

let defaultEmployee = {
    name: ''
}


 const htmlEmployees = (employee) => {
     console.log(employee.name);
    let newEmployee = `
    <tr class="nombre revenue">
        <td>
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
        renderData(data);
    })
}


///// CREAR EMPLEADO NUEVO /////
const addEmployeeBtn = document.querySelector('.add-employee');


const addEmployee = () => {
    hideMenu();
    bodyTable.innerHTML += htmlEmployees(defaultEmployee);
}

addEmployeeBtn.addEventListener('click', addEmployee);
traerEmpleados();