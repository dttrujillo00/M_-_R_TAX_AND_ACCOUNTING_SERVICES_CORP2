let business_id      = localStorage.getItem('id_bussines');
let storage_year     = localStorage.getItem('actual_year');
let month            = localStorage.getItem('actual_month');
let bussines         = localStorage.getItem('actual_business');


/**********************
 * MANEJADOR DEL MENU *
 *  *******************/
 const iconMenu = document.querySelector('.icon-menu img');
 const menu = document.querySelector('.menu');
 const secondIconMenu = document.querySelector('.menu > img');
 const body = document.querySelector('body');
 const closeMenuElement = document.querySelector('.hide-menu');
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

const retrocederHome = () => {
    window.location.pathname = 'pages/index.html';
}

iconMenu.addEventListener('click',showMenu);
secondIconMenu.addEventListener('click', hideMenu);
closeMenuElement.addEventListener('click', hideMenu);
home.addEventListener('click', retrocederHome);

/*******************************************************
 * MANEJADOR PARA POSICIONAR LAS TARJETAS DE LOS MESES *
 *  ****************************************************/

 const navegacionEmpresa = (e) => {
     if(e.target.classList.contains('nomina')){
        window.location.pathname = '/pages/nomina.html';
     } else {
        let id = e.target.getAttribute('data-id');
        console.log(id)
        localStorage.setItem("actual_month", id);
         window.location.pathname = '/pages/mes.html';
     }
}

const posicionarTarjetasMeses = () => {
    const meses = document.querySelectorAll('.mes');
    const filasMeses= document.querySelectorAll('.fila-mes');
    
    let index = 80;
    let count = 1;
    
    filasMeses.forEach( (fila, index) => {
        fila.style.bottom = `${-35*(index + 1)}px`;
    });
    
    // POSICIONAR TARJETAS POR CAPAS
    meses.forEach((mes) => {
        mes.style.zIndex = index;
        index--;
        mes.addEventListener('click', navegacionEmpresa);
    });
    
    meses.forEach((mes, index) => {
    
        if(index%7 !== 0){
        mes.style.transform = `translate(${-10*count}%)`;
        count++;
        } else {
            count = 1;
        }
    });
}

const empresaTitulo = document.querySelector('.empresa-name-container h1');
const year = document.querySelector('span.year');

year.innerText = localStorage.getItem('actual_year');
empresaTitulo.innerText = localStorage.getItem('actual_business');

document.addEventListener('DOMContentLoaded', async(e) => {
    posicionarTarjetasMeses();
    console.log("Estoy en cargando la pagina empresa");
    

    await getBalanceFromCurrentMonth();
    await getBalanceFromLastMonth();
 
    await getGrossProfit ();
    await getTotalExpenses();
})



const getBalanceFromLastMonth =async () => {
    await window.ipcRenderer.invoke('obtener_balance_del_mes_anterior',bussines).then((result) => {
        console.log("Se obtuvo el balance del mes anterior");
        console.log(result);
    })
}

const getBalanceFromCurrentMonth =async () => {
    await window.ipcRenderer.invoke('obtener_balance_del_mes',bussines,month,storage_year).then((result) => {
        console.log("Se obtuvo el balance del mes actual");
        console.log(result);
    })
}


const getGrossProfit =async () => {
    await window.ipcRenderer.invoke('obtener_ingresos_totales', bussines,storage_year).then((result) => {
        console.log("Se obtuvo el ingreso neto");
        console.log(result);
    })
}

const getTotalExpenses =async () => {
    await window.ipcRenderer.invoke('obtener_gastos_totales', bussines,storage_year).then((result) => {
        console.log("Se obtuvo los gatos totales");
        console.log(result);
    })
}