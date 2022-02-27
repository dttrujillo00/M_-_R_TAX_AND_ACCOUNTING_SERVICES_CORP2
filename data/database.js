const {ipcMain, Notification } = require('electron');
const { getConnection } = require('./db.config')


// Definiendo los handlers

//                          Inserts
ipcMain.handle('insertar_empleado', async (event, employee) => { 
	
	const field_name='employee';
	const { name, business_id} = employee;
	const sql ='INSERT INTO employee(employee_name, business_id) '+'VALUES('+name+', '+business_id+')';

	const employeeResult = await create(field_name,sql,employee);
	return employeeResult;
})

ipcMain.handle('insertar_empresa', async (event, business) => {
	
	const field_name='business';
	const {name} = business;
	const sql ='INSERT INTO business(business_name) '+'VALUES('+name+')';

	const businessResult = await create(field_name,sql,business);
	return businessResult;
})

ipcMain.handle('insertar_fecha', async (event, date) => {
	
	const field_name='date';
	const {day, month, year} = date;
	const sql ='INSERT INTO date(day, month, year) '+'VALUES('+ day +', '+ month +', '+ year+')';

	const dateResult = await create(field_name,sql,date);
	return dateResult;
})

ipcMain.handle('insertar_campo', async (event, field) => {
	
	const field_name='field';
	const {name} = field;
	const sql ='INSERT INTO field(field) '+'VALUES('+name+')';

	const fieldResult = await create(field_name,sql,field);
	return fieldResult;
})

ipcMain.handle('insertar_cuenta', async (event, account) => {
	const field_name='field';
	const { amount, is_positive, field_id, business_id} = account;
	const sql ='INSERT INTO account(amount, is_positive, field_id, business_id) '+'VALUES('+amount+', '+is_positive+', '+field_id+', '+business_id+')';
	const accountResult = await create(field_name,sql,account);
	return accountResult;
})

//                            Gets

ipcMain.handle('Obtener_campos_empresa_anno', async (event, business) => { 
	const { name, anno} = business;
	const sql ='SELECT field, SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) as amount FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id WHERE b.business_name =' +name+ 'AND d.year ='+anno+'GROUP BY field;'

	const fields = await get(sql);
	return fields;
})

ipcMain.handle('obtener_empleados_nomina', async (event, business) => { 
	
	const { name, anno} = business;
	const sql ='SELECT employee_name, payment_type, amount, month FROM employee e INNER JOIN payroll p ON e.employee_id = p.employee_id INNER JOIN payment_type pt ON pt.payment_type_id = p.payment_type_id INNER JOIN date d ON p.date_id = d.date_id INNER JOIN business b ON b.business_id = e.business_id WHERE b.business_name ='+name+'AND d.year ='+anno

	const employees = await get(sql);
	return employees;
})


ipcMain.handle('obtener_empresas_por_anno', async (event, year) => { 

	const sql =' SELECT DISTINCT b.business_id, b.business_name FROM business b LEFT JOIN employee e ON e.business_id = b.business_id LEFT JOIN payroll p ON e.employee_id = p.employee_id LEFT JOIN date de ON de.date_id = p.date_id LEFT JOIN account a ON a.business_id = b.business_id LEFT JOIN date da ON da.date_id = a.date_id WHERE de.year =' year' OR da.year =' +year
	const empresas = await get(sql);
	return empresas;
})


// ipcMain.handle('obtener_campo_cantidad', async (event, business) => { 
	
// 	const { name, anno,month} = business;
// 	const sql =''
// 	const field = await get(sql);
// 	return field;
// })

// ipcMain.handle('Obtener_campos_empresa_anno', async (event, business) => { 
	
// 	const { name, anno} = business;
// 	const sql =''
// 	const field = await get(sql);
// 	return field;
// })
// //                           Updates 

ipcMain.handle('editar_cantidad_campo', async (event, account) => { 
	const { amount, account_id} = account;
	const sql ='UPDATE account SET amount = '+amount+' WHERE account_id = '+account_id
	await edit(sql);
})

ipcMain.handle('editar_nombre_empleado', async (event, employee) => { 
	const { name, employee_id} = employee;
	const sql ='UPDATE employee SET employee_name = '+name+' WHERE employee_id = '+employee_id
	await edit(sql);
})

ipcMain.handle('editar_nombre_empresa', async (event, business) => { 
	const { name, business_id} = business;
	const sql ='UPDATE business SET business_name = '+name+' WHERE business_id = '+business_id
	await edit(sql);
})

//                           Delete

ipcMain.handle('eliminar_campo', async (event, id) => {
	const sql='DELETE FROM account WHERE account_id = '+id
	return await deleteObj(sql);
})

ipcMain.handle('eliminar_empleado', async (event, id) => {
	const sql='DELETE FROM employee WHERE employee_id = '+id
	return await deleteObj(sql);
})

ipcMain.handle('eliminar_empresa', async (event, id) => {
	const sql='DELETE FROM business WHERE business_id = '+id
	return await deleteObj(sql);
})


// Definiendo las funciones estandar de las consultas sql:
const create = async (field_name,sql,obj) => {
	const conn = getConnection();
	const result = await conn.query(sql);
	console.log(result);

	new Notification({
		title: 'Electron Sqlite3',
		body: 'New'+field_name+ 'saved successfully',
	}).show();

	obj.id = result.insertId;
	return obj;
}

async function get(sql) {
	const conn = getConnection();
	const result = await conn.query(sql);
	return result;

}

const edit = async (sql) => {
	const conn = await getConnection();
	const result = await conn.query(sql);
	console.log(result);
	return result;
}

const deleteObj = async (sql) => {
	const conn = await getConnection();
	const result = await conn.query('DELETE FROM product WHERE id=?', id);
	console.log(result);
	return result;
}

// Exportando funciones de consultas sql
// module.exports = {
// 	createProduct,
// 	getProducts
// }




