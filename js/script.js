import { showNotification } from './showNotification.js'

const contextMenu = document.querySelector(".contextMenu-container");
const year = document.querySelector("span.year");
let currentYear = new Date().getFullYear();
year.innerText = currentYear;
let listaEmpresas = [];
let editingBoolean = false

/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
const iconMenu = document.querySelector(".icon-menu img");
const menu = document.querySelector(".menu");
const secondIconMenu = document.querySelector(".menu > img");
const body = document.querySelector("body");
const closeMenuElement = document.querySelector(".hide-menu");
const liArchivo = document.querySelector(".li-archivo");
const archivoContent = document.querySelector(".archivo-content");


const auxiliarHideMenu = (e) => {
  if (e.target === body) {
    hideMenu();
  }
};

const showMenu = () => {
  body.classList.add("opacity");
  menu.classList.add("active");
  setTimeout(() => {
    secondIconMenu.classList.add("active");
  }, 300);

  document.addEventListener("click", auxiliarHideMenu);
};

const hideMenu = () => {
  body.classList.remove("opacity");
  menu.classList.remove("active");
  secondIconMenu.classList.remove("active");
  archivoContent.classList.remove("active");
  document.removeEventListener("click", auxiliarHideMenu);
};

const showArchivo = () => {
  archivoContent.classList.toggle("active");
};

function handleAnos() {
  const annos = archivoContent.querySelectorAll("li");
  
  
  annos.forEach((anno) => {
    anno.addEventListener("click", () => {
      hideMenu();
      archivoContent.classList.toggle("active");
  
      if (!anno.classList.contains('add-new-year')) {
        currentYear = anno.querySelector("p").innerText;
        year.innerText = currentYear;
        getEmpresas();
      } else {
        showMenu();
        liArchivo.click();
        const newLi = document.createElement('li');
        let contentLi = `
        <p><input class="inputForNewYear" type="text" autofocus></p>
        <img src="../icons/numero-year.png" alt="Year">
        `;
  
        newLi.innerHTML = contentLi;
        archivoContent.insertBefore(newLi, archivoContent.firstChild);

        let inputToAddYear = document.querySelector('.inputForNewYear');

        inputToAddYear.addEventListener('keydown', e => {
          if (e.code === 'Enter') {
            console.log(inputToAddYear.value);
            currentYear = inputToAddYear.value;
            year.innerText = currentYear;
            hideMenu();
            getEmpresas();
          }
        })

      }
    });
  });
}


iconMenu.addEventListener("click", showMenu);
secondIconMenu.addEventListener("click", hideMenu);
closeMenuElement.addEventListener("click", hideMenu);
liArchivo.addEventListener("click", showArchivo);

/************************************************************
 * MANEJADOR DEL POSICIONAMIENTO DE LAS TARJETAS DE EMPRESA *
 *  *********************************************************/

const posicionarTarjetasEmpresas = () => {
  const empresas = document.querySelectorAll(".empresa");
  const filasEmpresas = document.querySelectorAll(".fila-empresas");

  let index = 100;
  let count = 1;
  let count2 = 0;

  filasEmpresas.forEach((fila, index) => {
    fila.style.bottom = `${-35 * (index + 1)}px`;
  });

  // POSICIONAR TARJETAS POR CAPAS
  empresas.forEach((empresa) => {
    empresa.style.zIndex = index;
    index--;
    empresa.addEventListener("click", (e) => {

      if(!editingBoolean) {
        localStorage.setItem("actual_year", currentYear);
        localStorage.setItem("actual_business", empresa.title);
        localStorage.setItem("id_bussines", empresa.id);
        window.ipcRenderer.send("navegacion", 'pages/empresa.html');
      }


    });
    empresa.addEventListener("contextmenu", () => {
      empresas.forEach((emp) => {
        console.log(emp.children);
        emp.children[0].classList.remove("show");
      });
      empresa.children[0].classList.add("show");
    });
  });

  empresas.forEach((empresa, index) => {
    
    if (index % 11 !== 0) {
      empresa.style.transform = `translate(${-10 * count}%)`;
      count++;
    } else {
      count = 1;
      
    }

    empresa.addEventListener('mouseover', () => {

      if(index > 10) {
        count2 = index - 11;
      } else {
        count2 = index
      }

      // console.log(count2);
      // console.log(empresas[index])
      // console.log(empresa.querySelector('input'))
      empresa.style.transform = `translate(${-10 * count2}%, -10%)`;
      empresa.querySelector('input').style.transform = 'scale(1.150)';
    });

    empresa.addEventListener('mouseleave', () => {
      if(index > 10) {
        count2 = index - 11;
      } else {
        count2 = index
      }

      // console.log(count2);
      // console.log(empresas[index])
      empresa.style.transform = `translate(${-10 * count2}%)`;
      empresa.querySelector('input').style.transform = 'scale(1)';
    });

  });
};

/*****************************************
 * MANEJADOR PARA MODIFICAR LAS EMPRESAS *
 *  **************************************/
const modal = document.querySelector(".modal");

const showModal = (nombre) => {
  modal.children[1].innerText = nombre;
  modal.classList.add("active");
};

const hideModal = () => {
  modal.classList.remove("active");
};

// FUNCION ELIMINAR EMPRESA
const eliminarEmpresa = (e) => {
  e.stopPropagation();
  e.target.parentElement.parentElement.classList.remove("show");
  const btnAceptar = document.querySelector(".modal .btn-aceptar");
  const btnCancelar = document.querySelector(".modal .btn-cancelar");

  const nombre = e.target.parentElement.parentElement.parentElement.title;
  const id = e.target.parentElement.parentElement.parentElement.id;
  console.log("eliminando id: " + id);
  showModal(nombre);

  btnAceptar.addEventListener("click", async () => {
    await window.ipcRenderer.invoke("eliminar_empresa", parseInt(id));
    showNotification();
    console.log("se elimino correctamente");
    hideModal();
    getEmpresas();
    return;
  });

  btnCancelar.addEventListener("click", () => {
    hideModal();
  });
};

const manejadorModificarEmpresas = () => {
  const botonesEditar = document.querySelectorAll(".icon-pencil");
  const botonesEliminar = document.querySelectorAll(".icon-trash");
  const botonesCloseContextMenu = document.querySelectorAll(".icon-cancel");

  botonesCloseContextMenu.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.target.parentElement.parentElement.classList.remove("show");
    });
  });

  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", eliminarEmpresa);
  });

  botonesEditar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      editingBoolean = true;
      e.target.parentElement.parentElement.classList.remove("show");
      e.stopPropagation();

      let thisInput =
        e.target.parentElement.parentElement.nextSibling.nextSibling
          .childNodes[1];

      thisInput.removeAttribute("disabled");
      thisInput.focus();

      thisInput.addEventListener("keydown", async (e) => {
        if (e.code === "Enter") {
          thisInput.blur();
          thisInput.parentElement.parentElement.title = thisInput.value;

          let toEdit = {
            name: thisInput.value,
            business_id: e.target.parentElement.parentElement.id,
          };

          await window.ipcRenderer.invoke("editar_nombre_empresa", toEdit);
          thisInput.setAttribute("disabled", 'true');
          editingBoolean = false;
          showNotification();
        }
      });
    });
  });
};

/***************************************
 * MANEJADOR PARA AGREGAR LAS EMPRESAS *
 *  ************************************/
const liAgregarEmpresa = document.querySelector(".agregar-empresa");

const agregarTarjeta = () => {
  const empresas = document.querySelectorAll(".empresa");
  let exist = false;
  hideMenu();

  let newEmpresa = crearElementoHTMLEmpresa("", "");
  console.log(newEmpresa);

  if (empresas.length % 11 === 0) {
    filaEmpresa = document.createElement("ul");
    filaEmpresa.classList.add("fila-empresas");
    footer.appendChild(filaEmpresa);
  }

  filaEmpresa.innerHTML += newEmpresa;
  console.log(filaEmpresa);
  posicionarTarjetasEmpresas();
  manejadorModificarEmpresas();

  const empresasPlus = document.querySelectorAll(".empresa");
  console.log(empresasPlus.length);
  const nuevaEmpresa = empresasPlus[empresasPlus.length - 1];
  const inputNuevaEmpresa = nuevaEmpresa.querySelector("input");
  console.log(nuevaEmpresa);

  inputNuevaEmpresa.removeAttribute("disabled");
  inputNuevaEmpresa.focus();

  inputNuevaEmpresa.addEventListener("keydown", async (e) => {
    if (e.code === "Enter") {
      empresas.forEach((empresa) => {
        empresa.addEventListener("contextmenu", () => {
          empresas.forEach((emp) => {
            emp.children[0].classList.remove("show");
          });
          empresa.children[0].classList.add("show");
        });
      });
      inputNuevaEmpresa.blur();
      nuevaEmpresa.title = inputNuevaEmpresa.value;

      const business = {
        name: nuevaEmpresa.title,
        currentYear: currentYear,
      };

      listaEmpresas.forEach((empresa) => {
        if (business.name == empresa) {
          alert("❌Error: Esta empresa ya existe");
          exist = true;
          getEmpresas();
          return;
        }
      });
      if (!exist) {
        const result = await window.ipcRenderer.invoke(
          "insertar_empresa",
          business
        );
        await getEmpresas();
        showNotification();
      }
    }
  });
};

liAgregarEmpresa.addEventListener("click", agregarTarjeta);

/***************************************
 * MANEJADOR PARA OBTENER LAS EMPRESAS *
 *  ************************************/
const footer = document.querySelector(".footer");
let filaEmpresa;

const crearElementoHTMLEmpresa = (nombre, id) => {
  let element = `
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
};

const renderEmpresas = (empresas) => {
  const emptyFooter = ``;
  footer.innerHTML = emptyFooter;
  listaEmpresas.length = 0;

  empresas.forEach((empresa, index) => {
    if (index % 11 === 0) {
      filaEmpresa = document.createElement("ul");
      filaEmpresa.classList.add("fila-empresas");
      footer.appendChild(filaEmpresa);
    }

    filaEmpresa.innerHTML += crearElementoHTMLEmpresa(
      empresa.business_name,
      empresa.business_id
    );
    listaEmpresas.push(empresa.business_name);
  });

  console.log(footer);
}

const cretaeHTMLAno = year => {
  let element = `
  <li>
      <p>${year}</p>
      <img src="../icons/numero-year.png" alt="Year">
  </li>
  `;

  return element;
}

const renderAnos = (data) => {
  data.forEach( ({year}) => {
    archivoContent.innerHTML += cretaeHTMLAno(year);
  });

  archivoContent.innerHTML += `
  <li class="add-new-year">
    <p>Add a year</p>
    <img src="../icons/agregarElemento.png" alt="add">
  </li>
  `;
}

const getEmpresas = async () => {
  await window.ipcRenderer
    .invoke("obtener_empresas_por_anno", currentYear)
    .then((result) => {
      console.log("Se obtuvo las empresas del año " + currentYear);
      renderEmpresas(result);
      posicionarTarjetasEmpresas();
      manejadorModificarEmpresas();
    });
};

(async function init() {
  console.log("Inicio y pido los datos");
  await getEmpresas();
  await getAnnos();
})();


const getAnnos = async () => {
  await window.ipcRenderer
    .invoke("obtener_todos_los_anno")
    .then((result) => {
      console.log("Se obtuvo los annos " , result);
      renderAnos(result);
      handleAnos();
    });
};