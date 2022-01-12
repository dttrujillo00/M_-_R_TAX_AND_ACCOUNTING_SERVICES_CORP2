/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
const iconMenu = document.querySelector('.icon-menu img');
const menu = document.querySelector('.menu');
const secondIconMenu = document.querySelector('.menu > img');
const body = document.querySelector('body');
const closeMenuElement = document.querySelector('.hide-menu');
const liArchivo = document.querySelector('.li-archivo');
const archivoContent = document.querySelector('.archivo-content');

const showMenu = () => {
    body.classList.add('opacity');
    menu.classList.add('active');
    setTimeout(() => {
        secondIconMenu.classList.add('active');
    }, 300)
}

const hideMenu = () => {
    body.classList.remove('opacity');
    menu.classList.remove('active');
    secondIconMenu.classList.remove('active');
    archivoContent.classList.remove('active');
}

const showArchivo = () => {
    archivoContent.classList.toggle('active');
}

iconMenu.addEventListener('click',showMenu);
secondIconMenu.addEventListener('click', hideMenu);
closeMenuElement.addEventListener('click', hideMenu);
liArchivo.addEventListener('click', showArchivo);



/************************************************************
 * MANEJADOR DEL POSICIONAMIENTO DE LAS TARJETAS DE EMPRESA *
 *  *********************************************************/
 const posicionarTarjetasEmpresas = () => {
    const filasEmpresas = document.querySelectorAll('.fila-empresas');
    const empresas = document.querySelectorAll('.empresa');
    
    let index = 80;
    let count = 1;
    
    filasEmpresas.forEach( (fila, index) => {
        fila.style.bottom = `${-35*(index + 1)}px`;
    });
    
    // POSICIONAR TARJETAS POR CAPAS
    empresas.forEach((empresa) => {
        empresa.style.zIndex = index;
        index--;
    });
    
    empresas.forEach((empresa, index) => {
    
        if(index%11 !== 0){
        empresa.style.transform = `translate(${-10*count}%)`;
        count++;
        } else {
            count = 1;
        }
    });
}

/*****************************************
 * MANEJADOR PARA MODIFICAR LAS EMPRESAS *
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

// FUNCION ELIMINAR EMPRESA
const eliminarEmpresa = (e) => {
    const nombre = e.target.parentElement.title;
    const id = e.target.parentElement.id;
    // console.log(e.target.parentElement.title);
    showModal(nombre);
}
 const manejadorModificarEmpresas = () => {
    const liModificar = document.querySelector('.modificar-empresas');
    const checkIcon = document.querySelector('.check');
    const iconDeleteList = document.querySelectorAll('.empresa img');
    
    const changeIntoModify = () => {
        hideMenu();
        checkIcon.style.visibility = 'visible';
        iconDeleteList.forEach(icon => {
            icon.style.visibility = 'visible';
            icon.addEventListener('click', eliminarEmpresa);
        })
    }
    
    const changeOutModify = () => {
        hideModal();
        checkIcon.style.visibility = 'hidden';
        iconDeleteList.forEach(icon => {
            icon.style.visibility = 'hidden';
            icon.removeEventListener('click', eliminarEmpresa);
        })
    }
    
    liModificar.addEventListener('click', changeIntoModify);
    checkIcon.addEventListener('click', changeOutModify);
}

/**************************************
 * MANEJADOR PARA OBTENER LAS EMPRESA *
 *  ***********************************/
const footer = document.querySelector('footer');

 const renderEmpresas = (empresas) => {

    let filaEmpresa;

    empresas.forEach( (empresa,index) => {

        if(index%11 === 0){
            filaEmpresa = document.createElement("ul");
            filaEmpresa.classList.add('fila-empresas');
            footer.appendChild(filaEmpresa);
        }


        filaEmpresa.innerHTML += `
        <li title="${empresa.name}" class="empresa" id="${empresa.id}">
            <img src="./icons/delete.png" class="icon-delete">
            <div class="empresa-name">
                ${empresa.name}
            </div> 
        </li>
        `;
        
    });
}

const getEmpresas = () => {

    fetch('./empresas.json')
    .then(res => res.json())
    .then(data => {
        renderEmpresas(data.empresas);
        posicionarTarjetasEmpresas();
        manejadorModificarEmpresas();
    });

}

getEmpresas();