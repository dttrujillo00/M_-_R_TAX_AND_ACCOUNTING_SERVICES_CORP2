// 			IMPORTS
const {ipcMain} = require('electron');
const {getConnection} = require('./db.config')


//  								PAGINA INDEX
// ----------------------------------CREATE-----------------------------------------------
ipcMain.handle('insertar_empresa', async (event, business) => {
	

	const {name,currentYear} = business;
	const sql ='INSERT INTO business(business_name) '+'VALUES(\"'+name+'\")';

	const businessResult = await create(sql);

	IdBusssines = await bussines_id(name);
	console.log("Este es el anno: "+currentYear);
	poner_anno =await anno(IdBusssines[0].id,currentYear,business);


	return businessResult;
})

// Helpers
async function bussines_id(name){
	const  id_empresa = await get('SELECT business_id AS id FROM business WHERE business_name = \"'+name+'\"');
	return id_empresa;
}

async function anno(id,currentYear,business){
	console.log("ESTE ES EL ID: "+id+" ESTE ES EL ANNO: "+currentYear);
	const sql ='INSERT INTO business_year '+'VALUES('+id+', '+currentYear+')';
	const poner_anno =await create(sql)

	return poner_anno
}

// ------------------------------------GETS ----------------------------

ipcMain.handle('obtener_empresas_por_anno', async (event, year) => { 

	const sql = 'SELECT * FROM business b INNER JOIN business_year y ON b.business_id = y.business_id WHERE y.year = '+parseInt(year)
	const empresas = await get(sql);

	return empresas;
})

// ------------------------------------UPDATES------------------------------------

ipcMain.handle('editar_nombre_empresa', async (event, business) => { 
	const { name, business_id} = business;
	const sql ='UPDATE business SET business_name = \"'+name+'\" WHERE business_id = '+parseInt(business_id)
	await edit(sql);
})
// -------------------------------------DELETE-------------------------------------------

ipcMain.handle('eliminar_empresa', async (event, id) => {
	const sql='DELETE FROM business WHERE business_id = '+id
	return await deleteObj(sql);
})

//############################################################################################

// 									PAGINA EMPRESA
ipcMain.handle('obtener_balance_del_mes_anterior', async (event, name) => { 
	
	const sql ='SELECT '																												+
	'SUM(CASE WHEN month < 1 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS January, '		+
	'SUM(CASE WHEN month < 2 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS February, '	+
	'SUM(CASE WHEN month < 3 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS March, '		+
	'SUM(CASE WHEN month < 4 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS April, '		+
	'SUM(CASE WHEN month < 5 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS May, '			+
	'SUM(CASE WHEN month < 6 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS June, '		+ 
	'SUM(CASE WHEN month < 7 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS July, '		+
	'SUM(CASE WHEN month < 8 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS August, '		+ 
	'SUM(CASE WHEN month < 9 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS September, '	+ 
	'SUM(CASE WHEN month < 10 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS October, '	+
	'SUM(CASE WHEN month < 11 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS November, '	+
	'SUM(CASE WHEN month < 12 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS December, '	+
	'SUM(CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS YDT '															+
	'FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id '+
	'WHERE b.business_name = \"'+name+'\"';
	const result = await get(sql);
	return result;
})

ipcMain.handle('obtener_balance_del_mes', async (event, name,month,year) => { 

	const sql = 'SELECT '																								+
	'SUM(CASE month WHEN 1 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS January, ' 	+ 
	'SUM(CASE month WHEN 2 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS February, ' 	+ 
	'SUM(CASE month WHEN 3 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS March, ' 		+ 
	'SUM(CASE month WHEN 4 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS April, ' 		+  
	'SUM(CASE month WHEN 5 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS May, ' 		+
	'SUM(CASE month WHEN 6 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS June, ' 		+ 
	'SUM(CASE month WHEN 7 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS July, ' 		+ 
	'SUM(CASE month WHEN 8 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS August, ' 	+ 
	'SUM(CASE month WHEN 9 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS September, ' 	+ 
	'SUM(CASE month WHEN 10 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS October, ' 	+ 
	'SUM(CASE month WHEN 11 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS November, ' 	+ 
	'SUM(CASE month WHEN 12 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS December, ' 	+
	'SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS YDT '											+	
	'FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id '+ 
	'WHERE b.business_name = \"'+name+'\" AND d.year = '+year;
	const result = await get(sql);

	return result;
})

ipcMain.handle('obtener_ingresos_totales', async (event,name, year) => { 

	const sql = 'SELECT field AS Field, '																			+ 
	'SUM(CASE month WHEN 1 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS January, ' 	+ 
	'SUM(CASE month WHEN 2 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS February, ' 	+ 
	'SUM(CASE month WHEN 3 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS March, ' 		+ 
	'SUM(CASE month WHEN 4 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS April, ' 		+ 	
	'SUM(CASE month WHEN 5 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS May, ' 		+
	'SUM(CASE month WHEN 6 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS June, ' 		+ 
	'SUM(CASE month WHEN 7 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS July, ' 		+ 
	'SUM(CASE month WHEN 8 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS August, ' 		+ 
	'SUM(CASE month WHEN 9 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS September, ' 	+ 
	'SUM(CASE month WHEN 10 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS October, ' 	+ 
	'SUM(CASE month WHEN 11 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS November, ' 	+ 
	'SUM(CASE month WHEN 12 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) ELSE 0 END) AS December, '	+
	'SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE 0 END) AS YDT '+
	'FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id '+
	'WHERE b.business_name = \"'+name+'\" AND d.year = '+year+' GROUP BY field'
	const result = await get(sql);

	return result;
})

ipcMain.handle('obtener_gastos_totales', async (event,name, year) => { 

	const sql = 'SELECT field AS Field, '																			+
   'SUM(CASE month WHEN 1 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS January, ' 		+
   'SUM(CASE month WHEN 2 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS February, ' 	+
   'SUM(CASE month WHEN 3 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS March, ' 		+
   'SUM(CASE month WHEN 4 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS April, ' 		+
   'SUM(CASE month WHEN 5 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS May,' 			+
   'SUM(CASE month WHEN 6 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS June, ' 		+
   'SUM(CASE month WHEN 7 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS July, ' 		+
   'SUM(CASE month WHEN 8 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS August, ' 		+
   'SUM(CASE month WHEN 9 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS September, ' 	+
   'SUM(CASE month WHEN 10 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS October, ' 	+
   'SUM(CASE month WHEN 11 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS November, '	+
   'SUM(CASE month WHEN 12 THEN (CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) ELSE 0 END) AS December,' 	+
   'SUM( CASE a.is_positive WHEN TRUE THEN 0 ELSE amount END) AS YDT ' 												+
   'FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id ' +
   'WHERE b.business_name = \"'+name+'\" AND d.year = '+year+' GROUP BY field'
	const result = await get(sql);

	return result;
})

// #######################################################################################

//										PAGINA MES

// ---------------------------------CREATE------------------------------

ipcMain.handle('agregar_operacion', async (event, date,operation,amount,gasto,business_id) => {
	
	id_fecha = await obtener_id_por_fecha(date);
	id_field = await obtener_id_por_campo(operation);


	const account = { 
		amount: amount, 
		is_positive: gasto, 
		field_id: id_field, 
		business_id: business_id,
		date_id: id_fecha,
	} ;

	cuenta =await insertar_cuenta(account);
	
	
	
	return cuenta; 
})

// HELPERS
async function insertar_fecha(date){

	const [year, month, day] = date.split('-')
	const sql ='INSERT INTO date(day, month, year) '+'VALUES('+ parseInt(day) +', '+ parseInt(month) +', '+ parseInt(year)+')';

	
	const dateResult = await create(sql);
	return dateResult; 
}

async function obtener_id_por_fecha(date){
	const [year, month, day] = date.split('-')
	id_fecha = await get('SELECT date_id FROM date WHERE year = ' +parseInt(year)+' AND month = '+parseInt(month)+' AND day = '+parseInt(day));
	if(id_fecha[0] == undefined){
		await insertar_fecha(date);
		id_fecha = await get('SELECT date_id FROM date WHERE year = ' +parseInt(year)+' AND month = '+parseInt(month)+' AND day = '+parseInt(day));
	}

	return 	id_fecha[0].date_id;
}

async function insertar_campo (field){
	

	const sql ='INSERT INTO field(field) '+'VALUES(\"'+field+'\")';

	
	const fieldResult = await create(sql);
	return fieldResult;
}

async function obtener_id_por_campo(operation){

	field_id = await get('SELECT field_id FROM field WHERE field = \"'+operation+'\"');

	if(field_id[0] == undefined){
		await insertar_campo(operation);
		field_id = await get('SELECT field_id FROM field WHERE field = \"'+operation+'\"');

	}
	return field_id[0].field_id;
}

async function insertar_cuenta(account) {

	const { amount, is_positive, field_id, business_id, date_id} = account;
	const sql ='INSERT INTO account(amount, is_positive, field_id, business_id, date_id) '+'VALUES('+amount+', '+is_positive+', '+field_id+', '+business_id+', '+date_id+')';
	const accountResult = await create(sql);
	return accountResult;
}

// ------------------------------------GETS----------------------------------

ipcMain.handle('obtener_cuentas_por_anno', async (event, name ,month,year) => { 
	const sql ='SELECT account_id, amount, is_positive, f.field_id, field, b.business_id, business_name, year, month, day FROM account a LEFT JOIN date d ON a.date_id = d.date_id LEFT JOIN business b ON a.business_id = b.business_id LEFT JOIN field f ON a.field_id = f.field_id WHERE b.business_name = \"'+name+'\" AND d.year = '+year+' AND d.month = '+month
	const fields = await get(sql);
	return fields;
})

ipcMain.handle('Obtener_campos_empresa_anno', async (event, name ,year) => { 
	const sql ='SELECT field AS Field, SUM(CASE month WHEN 1 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS January, SUM(CASE month WHEN 2 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS February, SUM(CASE month WHEN 3 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS March, SUM(CASE month WHEN 4 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS April, SUM(CASE month WHEN 5 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS May,SUM(CASE month WHEN 6 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS June, SUM(CASE month WHEN 7 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS July, SUM(CASE month WHEN 8 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS August, SUM(CASE month WHEN 9 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS September, SUM(CASE month WHEN 10 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS October, SUM(CASE month WHEN 11 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS November, SUM(CASE month WHEN 12 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS December,SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS YDT FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id WHERE b.business_name = \"'+name+'\" AND d.year = '+parseInt(year)+' GROUP BY field'
	const fields = await get(sql);
	return fields;
})

ipcMain.handle('obtener_campos_por_mes', async (event, name,year, month) => { 

	const sql = 'SELECT field AS Field,SUM(CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS YDT FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id WHERE b.business_name =\"'+name+'\" AND year ='+year+' AND month ='+month+' GROUP BY field'
	const empresas = await get(sql);

	return empresas;
})

// ------------------------------------UPDATES-------------------------------- 

ipcMain.handle('editar_cantidad_campo', async (event, account) => { 
	const { amount, account_id} = account;
	const sql ='UPDATE account SET amount = '+amount+' WHERE account_id = '+account_id
	await edit(sql);
})

ipcMain.handle('editar_cuenta', async (event, business_id,id_account,is_positive,date,operation,amount) => {

	let id_fecha = await obtener_id_por_fecha(date);
	let id_field = await obtener_id_por_campo(operation);
	
	const sql ='UPDATE account SET amount = '+amount+', is_positive = '+is_positive+', field_id = '+id_field+', business_id = '+business_id+', date_id = '+id_fecha+' WHERE account_id = '+id_account
	await edit(sql);
})

//---------------------------------------DELETE----------------------------------

ipcMain.handle('eliminar_operacion', async (event, id) => {
	const sql='DELETE FROM account WHERE account_id = '+id
	return await deleteObj(sql);
})

// ######################################################################################

// 									PAGINA NOMINA

// -------------------------------------CREATE------------------------------------
ipcMain.handle('insertar_empleado', async (event, employee) => { 
	
	const field_name='employee';
	const { name, business_id} = employee;
	const sql ='INSERT INTO employee(employee_name, business_id) '+'VALUES('+name+', '+business_id+')';

	const employeeResult = await create(field_name,sql);
	return employeeResult;
})

// -------------------------------------UPDATE------------------------------------

ipcMain.handle('editar_nombre_empleado', async (event, employee) => { 
	const { name, employee_id} = employee;
	const sql ='UPDATE employee SET employee_name = '+name+' WHERE employee_id = '+employee_id
	await edit(sql);
})

// -------------------------------------DELETE------------------------------------

ipcMain.handle('eliminar_empleado', async (event, id) => {
	const sql='DELETE FROM employee WHERE employee_id = '+id
	return await deleteObj(sql);
})


// ##########################################################################################
// 								FUNCIONES ESTANDARES PARA HACER CRUD


const create = async (sql) => {
	const conn = getConnection();
	const result = await conn.query(sql);
	console.log(result);
	return result;
}

async function get(sql) {
	const conn = getConnection();
	const result = await conn.query(sql);
	return result;

}

const edit = async (sql) => {
	const conn =  getConnection();
	const result = await conn.query(sql);
	console.log(result);
	return result;
}

const deleteObj = async (sql) => {
	const conn =  getConnection();
	const result = await conn.query(sql);
	console.log(result);
	return result;
}

