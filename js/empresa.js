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
    let count2 = 0;
    
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

        mes.addEventListener('mouseover', () => {

            if(index > 6) {
              count2 = index - 7;
            } else {
              count2 = index
            }
      
            console.log(count2);
            console.log(meses[index])
            console.log(mes.querySelector('input'))
            mes.style.transform = `translate(${-10 * count2}%, -10%)`;
            mes.querySelector('input').style.transform = 'scale(1.150)';
          });

          mes.addEventListener('mouseleave', () => {
            if(index > 6) {
              count2 = index - 7;
            } else {
              count2 = index
            }
      
            console.log(count2);
            console.log(meses[index])
            mes.style.transform = `translate(${-10 * count2}%)`;
            mes.querySelector('input').style.transform = 'scale(1)';
          });
      

    });
}

/*************************
 * MANEJADOR RENDER DATA *
 *  **********************/
const bodyTable = document.querySelector('.enterprise-table tbody');
let bodyHTML = `
    <tr class="revenue">
        <td>Revenue</td>
        <td colspan="13"></td>
    </tr>
`;

const renderHTMLRow = (dataRow) => {
    let element = `
        <tr>
            <td>${dataRow.Field}</td>
            <td>${dataRow.January === 0 || dataRow.January === null ? '' : dataRow.January}</td>
            <td>${dataRow.February === 0 || dataRow.February === null ? '' : dataRow.February}</td>
            <td>${dataRow.March === 0 || dataRow.March === null ? '' : dataRow.March}</td>
            <td>${dataRow.April === 0 || dataRow.April === null ? '' : dataRow.April}</td>
            <td>${dataRow.May === 0 || dataRow.May === null ? '' : dataRow.May}</td>
            <td>${dataRow.June === 0 || dataRow.June === null ? '' : dataRow.June}</td>
            <td>${dataRow.July === 0 || dataRow.July === null ? '' : dataRow.July}</td>
            <td>${dataRow.August === 0 || dataRow.August === null ? '' : dataRow.August}</td>
            <td>${dataRow.September === 0 || dataRow.September === null ? '' : dataRow.September}</td>
            <td>${dataRow.October === 0 || dataRow.October === null ? '' : dataRow.October}</td>
            <td>${dataRow.November === 0 || dataRow.November === null ? '' : dataRow.November}</td>
            <td>${dataRow.December === 0 || dataRow.December === null ? '' : dataRow.December}</td>
            <td>${dataRow.YDT === 0 || dataRow.YDT === null ? '' : dataRow.YDT}</td>
        </tr>
    `;

    return element;
} 

const renderBalanceFromLastMonth = (data) => {
    data[0].Field = 'Balance from Last Month';
    bodyHTML += renderHTMLRow(data[0]);
    bodyTable.innerHTML = bodyHTML;
}

const renderRevenue = (totalRevenue) => {
    // console.log('Render revenue function');
    // console.log(totalRevenue);
    let totalRevenues = {
        Field: 'Gross Profit'
    };

    totalRevenue.forEach( revenue => {
        if(revenue.YDT !== 0) {
            // console.log(revenue.Field + " " + revenue.YDT);
            bodyHTML += renderHTMLRow(revenue);
        }
    });

    bodyHTML += `
        <tr class="white-line">
            <td colspan="14"></td>
        </tr>
    `;
    
    bodyTable.innerHTML = bodyHTML;
}

const renderExpense = (totalExpense) => {
    // console.log('Render revenue function');
    // console.log(totalExpense);

    bodyHTML += `
        <tr class="operating-expenses">
            <td>Operating Expenses</td>
            <td colspan="13"></td>
        </tr>
    `;

    totalExpense.forEach( expense => {
        if(expense.YDT !== 0) {
            // console.log(expense.Field + " " + expense.YDT);
            bodyHTML += renderHTMLRow(expense);
        }
    });
    
    bodyTable.innerHTML = bodyHTML;
}

const renderNetIncome = (data) => {
    data[0].Field = 'Net Income';
    bodyHTML += renderHTMLRow(data[0]);
    bodyTable.innerHTML = bodyHTML;
}

const empresaTitulo = document.querySelector('.empresa-name-container h1');
const year = document.querySelector('span.year');

year.innerText = localStorage.getItem('actual_year');
empresaTitulo.innerText = localStorage.getItem('actual_business');
empresaTitulo.setAttribute('title', localStorage.getItem('actual_business'))

document.addEventListener('DOMContentLoaded', async(e) => {
    posicionarTarjetasMeses();
    console.log("Estoy en cargando la pagina empresa");
    
    await getBalanceFromLastMonth();
    await getGrossProfit ();
    await getTotalExpenses();
    await getBalanceFromCurrentMonth();
 

})



const getBalanceFromLastMonth =async () => {
    await window.ipcRenderer.invoke('obtener_balance_del_mes_anterior',bussines).then((result) => {
        console.log("Se obtuvo el balance del mes anterior");
        console.log(result);
        renderBalanceFromLastMonth(result);
    })
}

const getBalanceFromCurrentMonth =async () => {
    await window.ipcRenderer.invoke('obtener_balance_del_mes',bussines,month,storage_year).then((result) => {
        console.log("Se obtuvo el balance del mes actual");
        console.log(result);
        renderNetIncome(result);
    })
}


const getGrossProfit =async () => {
    await window.ipcRenderer.invoke('obtener_ingresos_totales', bussines,storage_year).then((result) => {
        console.log("Se obtuvo el ingreso neto");
        console.log(result);
        renderRevenue(result);
    })
}

const getTotalExpenses =async () => {
    await window.ipcRenderer.invoke('obtener_gastos_totales', bussines,storage_year).then((result) => {
        // console.log("Se obtuvo los gatos totales");
        // console.log(result);
        renderExpense(result);
    })
}