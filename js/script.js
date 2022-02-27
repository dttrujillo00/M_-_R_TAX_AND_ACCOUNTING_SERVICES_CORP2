// const ipcRenderer =window.ipcRenderer
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
    archivoContent.classList.remove('active');
    document.removeEventListener('click', auxiliarHideMenu)
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

const navegacionEmpresa = () => {
    window.location.pathname = '/pages/empresa.html';
}

const posicionarTarjetasEmpresas = () => {
    const empresas = document.querySelectorAll('.empresa');
    const filasEmpresas = document.querySelectorAll('.fila-empresas');
    
    let index = 100;
    let count = 1;
    
    filasEmpresas.forEach( (fila, index) => {
        fila.style.bottom = `${-35*(index + 1)}px`;
    });
    
    // POSICIONAR TARJETAS POR CAPAS
    empresas.forEach((empresa) => {
        empresa.style.zIndex = index;
        index--;
        empresa.addEventListener('click', navegacionEmpresa);
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
const eliminarEmpresa =  async(e) => {
    const nombre = e.target.parentElement.title;
    const id = e.target.parentElement.id;
    console.log("eliminando id: "+e.target.parentElement.id);
    showModal(nombre);

    await window.ipcRenderer.invoke('eliminar_empresa', parseInt(id));
    console.log("se elimino correctamente")
    return ;
}

const manejadorModificarEmpresas = () => {
    const empresas = document.querySelectorAll('.empresa');
    const liModificar = document.querySelector('.modificar-empresas');
    const checkIcon = document.querySelector('.check');
    const iconDeleteList = document.querySelectorAll('.empresa img');
    const inputs = document.querySelectorAll('.empresa .empresa-name input');
    let value;
    
    const changeIntoModify = () => {
        empresas.forEach(empresa => {
            empresa.removeEventListener('click', navegacionEmpresa);
        });
        hideMenu();
        checkIcon.style.visibility = 'visible';
        iconDeleteList.forEach(icon => {
            icon.style.visibility = 'visible';
            icon.addEventListener('click', eliminarEmpresa);
        });

        inputs.forEach( input => {
            input.removeAttribute('disabled');
            // input.addEventListener('input', e => {
            //     value = input.value;
            // });
            input.addEventListener('keydown', e => {
                if(e.code === 'Enter'){
                    input.blur();
                    input.parentElement.parentElement.title = input.value
                }
            })
        });
    }
    
    const changeOutModify = () => {
        empresas.forEach(empresa => {
            empresa.addEventListener('click', navegacionEmpresa);
        });
        hideModal();
        checkIcon.style.visibility = 'hidden';
        iconDeleteList.forEach(icon => {
            icon.style.visibility = 'hidden';
            icon.removeEventListener('click', eliminarEmpresa);
        });

        inputs.forEach( input => {
            input.setAttribute('disabled', 'true');
        });
    }
    
    liModificar.addEventListener('click', changeIntoModify);
    checkIcon.addEventListener('click', changeOutModify);
}

/***************************************
 * MANEJADOR PARA OBTENER LAS EMPRESAS *
 *  ************************************/
const footer = document.querySelector('footer');
let filaEmpresa;

const crearElementoHTMLEmpresa = (nombre, id, index) => {
    element = `
    <li title="${nombre}" class="empresa" id="${id}">
        <img src="../icons/delete.png" class="icon-delete">
        <div class="empresa-name">
            <input type="text" value="${nombre}" disabled>
        </div> 
    </li>
    `;
    return element;
}

 const renderEmpresas = (empresas) => {

    empresas.forEach( (empresa,index) => {
        if(index%11 === 0){
            filaEmpresa = document.createElement("ul");
            filaEmpresa.classList.add('fila-empresas');
            footer.appendChild(filaEmpresa);
        }


        filaEmpresa.innerHTML += crearElementoHTMLEmpresa(empresa.business_name, empresa.business_id);
        
    });
}

const getEmpresas =async () => {
    const year = 2022;
    await window.ipcRenderer.invoke('obtener_empresas_por_anno',year).then((result) => {
        console.log("Termino la consulta");
        console.log(result);
	    renderEmpresas(result);
        posicionarTarjetasEmpresas();
        manejadorModificarEmpresas();
    })
    
    // fetch('../empresas.json')
    // .then(res => res.json())
    // .then(data => {
    //     renderEmpresas(data.empresas);
    //     posicionarTarjetasEmpresas();
    //     manejadorModificarEmpresas();
    // });

}



/***************************************
 * MANEJADOR PARA AGREGAR LAS EMPRESAS *
 *  ************************************/
const liAgregarEmpresa = document.querySelector('.agregar-empresa');

const agregarTarjeta = () => {
    hideMenu();
    filaEmpresa.innerHTML += crearElementoHTMLEmpresa('', '');
    posicionarTarjetasEmpresas();
    manejadorModificarEmpresas();

    const empresas = document.querySelectorAll('.empresa');
    const nuevaEmpresa = empresas[empresas.length - 1];
    const inputNuevaEmpresa = nuevaEmpresa.querySelector('input');
    console.log(empresas.length);
    if(empresas.length%11 === 0){
        filaEmpresa = document.createElement("ul");
        filaEmpresa.classList.add('fila-empresas');
        footer.appendChild(filaEmpresa);
    }

    inputNuevaEmpresa.removeAttribute('disabled');
    inputNuevaEmpresa.focus();
    inputNuevaEmpresa.addEventListener('keydown', async(e) => {
        if(e.code === 'Enter'){
            inputNuevaEmpresa.blur();
            nuevaEmpresa.title = inputNuevaEmpresa.value;
            nuevaEmpresa.id = 100;

	        const business = {
		        name: nuevaEmpresa.title,
	        }

            const result = await window.ipcRenderer.invoke('insertar_empresa', business);
        }
    });
}

liAgregarEmpresa.addEventListener('click', agregarTarjeta);


(async function init() {
	await getEmpresas();
    console.log("Inicio y pido los datos");
})();