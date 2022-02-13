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

//                            Gets
ipcMain.handle('obtener_campo_cantidad', async (event, employee) => {
	
	const field_name='employee';
	const { name, business_id} = employee;
	const sql ='INSERT INTO employee(employee_name, business_id) '+'VALUES('+name+', '+business_id+')';

	const employee = await create(field_name,sql,employee);
	return employee;
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