const { BrowserWindow, ipcMain, ipcRenderer, Notification } = require('electron');
const { getConnection } = require('./db.config')

ipcMain.handle('some', async (event, someArgument) => {
	const product = await createProduct(someArgument);
	return product;
})

ipcMain.handle('get-products', async (event, arg) => {
	const result = await getProducts();
	console.log(result);
	return result;
})

ipcMain.handle('delete', async (event, id) => {
	return await deleteProduct(id);
})

ipcMain.handle('getProductById', async (event, id) => await getProductById(id))
ipcMain.handle('editProduct', async (event, id, product) => {
	await editProduct(id, product);
})


const createProduct = async (product) => {
	const conn = getConnection();
	product.price = parseFloat(product.price);
	const { name, description, price } = product
	const result = await conn.query('INSERT INTO product(name, description,price) VALUES(?,?,?)', [name, description, price]);
	console.log(result);

	new Notification({
		title: 'Electron Mysql',
		body: 'New Product saved successfully',
	}).show();

	product.id = result.insertId;
	return product;
}

async function getProducts() {
	const conn = getConnection();
	const result = await conn.query('SELECT * FROM product ORDER BY id DESC');
	return result;

}

function createWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})
	window.loadFile('src/ui/index.html');
}

const deleteProduct = async (id) => {
	const conn = await getConnection();
	const result = await conn.query('DELETE FROM product WHERE id=?', id);
	console.log(result);
	return result;
}

const editProduct = async (id, product) => {
	const conn = await getConnection();
	const { name, description, price } = product;
	const result = await conn.query('UPDATE product SET name=?, description=?, price=? WHERE id=?', [name, description, price, id]);
	console.log(result);
	return result;
}

const getProductById = async (id) => {
	const conn = await getConnection();
	const result = await conn.query('SELECT * FROM product WHERE id=?', id);
	return result[0];
}

module.exports = {
	createWindow,
	createProduct,
	getProducts
}