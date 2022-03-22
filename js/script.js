
const contextMenu = document.querySelector('.contextMenu-container');
const year = document.querySelector('span.year');
let currentYear = new Date().getFullYear();
year.innerText = currentYear;
let listaEmpresas =[];



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
const annos = archivoContent.querySelectorAll('li');

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

annos.forEach(anno => {
    anno.addEventListener('click', () => {
        hideMenu();
        archivoContent.classList.toggle('active');
        currentYear = anno.querySelector('p').innerText;
        year.innerText = currentYear;
        getEmpresas();
    })
})

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
        empresa.addEventListener('contextmenu', (e) => {
            empresas.forEach( emp => {
                emp.childNodes[1].classList.remove('show')
            })
            empresa.childNodes[1].classList.add('show')
        });
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


const showModal = nombre => {
    modal.children[1].innerText = nombre;
    modal.classList.add('active');
}

const hideModal = () => {
    modal.classList.remove('active');
}

// FUNCION ELIMINAR EMPRESA
const eliminarEmpresa =  (e) => {
    const btnAceptar = document.querySelector('.modal .btn-aceptar');
    const btnCancelar = document.querySelector('.modal .btn-cancelar');

    const nombre = e.target.parentElement.title;
    const id = e.target.parentElement.id;
    console.log("eliminando id: "+id);
    showModal(nombre);

    btnAceptar.addEventListener('click', async () => {
        await window.ipcRenderer.invoke('eliminar_empresa', parseInt(id));
        console.log("se elimino correctamente")
        return ;
    });

    btnCancelar.addEventListener('click', () => {
        hideModal();
    });

}

const manejadorModificarEmpresas = () => {
    const empresas = document.querySelectorAll('.empresa');
    const liModificar = document.querySelector('.modificar-empresas');
    const checkIcon = document.querySelector('.check');
    const iconDeleteList = document.querySelectorAll('.empresa img');
    const inputs = document.querySelectorAll('.empresa .empresa-name input');
    let empresasToEdit = []
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

            input.addEventListener('keydown', e => {
                if(e.code === 'Enter'){
                    input.blur();
                    input.parentElement.parentElement.title = input.value

                    let toEdit = {
                        name: input.value,
                        business_id:e.target.parentElement.id
                    }

                    empresasToEdit.push(toEdit);
                }
            })
        });
    }
    
    const changeOutModify = () => {
        //EJECUTAR CONSULTAS PARA EDITAR LAS EMPRESAS
        empresasToEdit.forEach(async(empresa) => {
            await window.ipcRenderer.invoke('editar_nombre_empresa', empresa);
        });


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
 * MANEJADOR PARA AGREGAR LAS EMPRESAS *
 *  ************************************/
const liAgregarEmpresa = document.querySelector('.agregar-empresa');

const agregarTarjeta = () => {
    let exist = false;
    hideMenu();

    filaEmpresa.innerHTML += crearElementoHTMLEmpresa('', '');
    posicionarTarjetasEmpresas();
    manejadorModificarEmpresas();

    const empresas = document.querySelectorAll('.empresa');
    const nuevaEmpresa = empresas[empresas.length - 1];
    const inputNuevaEmpresa = nuevaEmpresa.querySelector('input');
    console.log("Cantidad de empresas: "+empresas.length);
    if(empresas.length%11 === 0){
        filaEmpresa = document.createElement("ul");
        filaEmpresa.classList.add('fila-empresas');
        footer.appendChild(filaEmpresa);
    }


    inputNuevaEmpresa.removeAttribute('disabled');
    inputNuevaEmpresa.focus();

    empresas.forEach(empresa => {
        empresa.removeEventListener('click', navegacionEmpresa);
    });

    inputNuevaEmpresa.addEventListener('keydown', async(e) => {
        if(e.code === 'Enter'){
            empresas.forEach(empresa => {
                empresa.addEventListener('click', navegacionEmpresa);
                empresa.addEventListener('contextmenu', (e) => {
                    empresas.forEach( emp => {
                        emp.childNodes[1].classList.remove('show')
                    })
                    empresa.childNodes[1].classList.add('show')
                });
            });
            inputNuevaEmpresa.blur();
            nuevaEmpresa.title = inputNuevaEmpresa.value;


	        const business = {
		        name: nuevaEmpresa.title,
                currentYear: currentYear
	        }

            listaEmpresas.forEach((empresa)=>{
                if(business.name == empresa){
                    alert("❌Error: Esta empresa ya existe");
                    exist = true;
                    return;
                }
            });
            if (!exist) {
                const result = await window.ipcRenderer.invoke('insertar_empresa', business);
                await getEmpresas();
            }
            
        }
    });
}

liAgregarEmpresa.addEventListener('click', agregarTarjeta);

/***************************************
 * MANEJADOR PARA OBTENER LAS EMPRESAS *
 *  ************************************/
 const footer = document.querySelector('.footer');
 let filaEmpresa;
 
 const crearElementoHTMLEmpresa = (nombre, id) => {
     console.log("Empresa: "+nombre);
    element =`
     <li title="${nombre}" class="empresa" id="${id}">
        <div class="contextMenu-container">
            <ul>
                <li class="icon-pencil"></li>
                <li class="icon-trash"></li>
                <li class="icon-cancel"></li>
            </ul>
        </div>
        <div class="empresa-name">
            <input type="text" value="${nombre}" disabled>
        </div> 
     </li>
     `;
     return element;
 }
 
  const renderEmpresas = (empresas) => {
     const emptyFooter = ``;
     footer.innerHTML = emptyFooter;

    //  filaEmpresa = document.createElement("ul");
    //  filaEmpresa.classList.add('fila-empresas');
    //  footer.appendChild(filaEmpresa);
 
     empresas.forEach( (empresa,index) => {
 
         if(index%11 === 0){
             filaEmpresa = document.createElement("ul");
             filaEmpresa.classList.add('fila-empresas');
             footer.appendChild(filaEmpresa);
         }
 
        filaEmpresa.innerHTML += crearElementoHTMLEmpresa(empresa.business_name, empresa.business_id);
        listaEmpresas.push(empresa.business_name);
     });
    
     console.log(filaEmpresa);
 }
 
 const getEmpresas =async () => {
 
     await window.ipcRenderer.invoke('obtener_empresas_por_anno',currentYear).then((result) => {
         console.log("Se obtuvieron las empresas del año "+currentYear);
         renderEmpresas(result);
         posicionarTarjetasEmpresas();
         manejadorModificarEmpresas();

     })
 
 }


(async function init() {
    console.log("Inicio y pido los datos");
	await getEmpresas();
})();