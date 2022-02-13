const { BrowserWindow, ipcMain, ipcRenderer, Notification } = require('electron');
const { getConnection } = require('./db.config')


// Definiendo los handlers

//                          Inserts
ipcMain.handle('insertar_empleado', async (event, employee) => { 
	
	const field_name='employee';
	const { name, business_id} = employee;
	const sql ='INSERT INTO employee(employee_name, business_id) '+'VALUES('+name+', '+business_id+')';

	const employee = await create(field_name,sql,employee);
	return employee;
})

ipcMain.handle('insertar_empresa', async (event, business) => {
	
	const field_name='business';
	const {name} = business;
	const sql ='INSERT INTO business(business_name) '+'VALUES('+name+')';

	const business = await create(field_name,sql,business);
	return business;
})

ipcMain.handle('insertar_fecha', async (event, date) => {
	
	const field_name='date';
	const {day, month, year} = date;
	const sql ='INSERT INTO date(day, month, year) '+'VALUES('+ day +', '+ month +', '+ year+')';

	const date = await create(field_name,sql,date);
	return date;
})

ipcMain.handle('insertar_campo', async (event, field) => {
	
	const field_name='field';
	const {name} = field;
	const sql ='INSERT INTO field(field) '+'VALUES('+name+')';

	const field = await create(field_name,sql,field);
	return field;
})

ipcMain.handle('insertar_cuenta', async (event, account) => {
	const field_name='field';
	const { amount, is_positive, field_id, business_id} = account;
	const sql ='INSERT INTO account(amount, is_positive, field_id, business_id) '+'VALUES('+amount+', '+is_positive+', '+field_id+', '+business_id+')';

	const account = await create(field_name,sql,account);
	return account;
})

//                            Gets

ipcMain.handle('Obtener_campos_empresa_anno', async (event, business) => { 
	
	const field_name='business';
	const { name, anno} = business;
	const sql ='SELECT field, SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) as amount FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id WHERE b.business_name =' +name+ 'AND d.year ='+anno+'GROUP BY field;'

	const fields = await get(sql);
	return fields;
})



ipcMain.handle('obtener_empleados_nomina', async (event, business) => { 
	
	const field_name='business';
	const { name, anno} = business;
	const sql ='SELECT employee_name, payment_type, amount, month FROM employee e INNER JOIN payroll p ON e.employee_id = p.employee_id INNER JOIN payment_type pt ON pt.payment_type_id = p.payment_type_id INNER JOIN date d ON p.date_id = d.date_id INNER JOIN business b ON b.business_id = e.business_id WHERE b.business_name ='+name+'AND d.year ='+anno

	const employees = await get(sql);
	return employees;
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

// Exportando funciones de consultas sql
module.exports = {
	createProduct,
	getProducts
}






// ipcMain.handle('some', async (event, someArgument) => {
// 	const product = await createProduct(someArgument);
// 	return product;
// })

// ipcMain.handle('get-products', async (event, arg) => {
// 	const result = await getProducts();
// 	console.log(result);
// 	return result;
// })

// ipcMain.handle('delete', async (event, id) => {
// 	return await deleteProduct(id);
// })

// ipcMain.handle('getProductById', async (event, id) => await getProductById(id))
// ipcMain.handle('editProduct', async (event, id, product) => {
// 	await editProduct(id, product);
// })


// const createProduct = async (product) => {
// 	const conn = getConnection();
// 	product.price = parseFloat(product.price);
// 	const { name, description, price } = product
// 	const result = await conn.query('INSERT INTO product(name, description,price) VALUES(?,?,?)', [name, description, price]);
// 	console.log(result);

// 	new Notification({
// 		title: 'Electron Mysql',
// 		body: 'New Product saved successfully',
// 	}).show();

// 	product.id = result.insertId;
// 	return product;
// }

// async function getProducts() {
// 	const conn = getConnection();
// 	const result = await conn.query('SELECT * FROM product ORDER BY id DESC');
// 	return result;

// }



// const deleteProduct = async (id) => {
// 	const conn = await getConnection();
// 	const result = await conn.query('DELETE FROM product WHERE id=?', id);
// 	console.log(result);
// 	return result;
// }

// const editProduct = async (id, product) => {
// 	const conn = await getConnection();
// 	const { name, description, price } = product;
// 	const result = await conn.query('UPDATE product SET name=?, description=?, price=? WHERE id=?', [name, description, price, id]);
// 	console.log(result);
// 	return result;
// }

// const getProductById = async (id) => {
// 	const conn = await getConnection();
// 	const result = await conn.query('SELECT * FROM product WHERE id=?', id);
// 	return result[0];
// }

// module.exports = {
// 	createWindow,
// 	createProduct,
// 	getProducts
// }