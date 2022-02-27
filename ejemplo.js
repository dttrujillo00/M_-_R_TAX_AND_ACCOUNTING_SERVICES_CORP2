// const { ipcRenderer } = require('electron')

// const productName = document.getElementById('name');
// const productPrice = document.getElementById('price');
// const productDescription = document.getElementById('description');
// const productsList = document.getElementById('products');

// let products = [];
// let editingStatus = false;
// let productId = '';

// const deleteProduct = async (id) => {
// 	const response = confirm('Are your sure you want to delede it?')
// 	if (response) {
// 		await ipcRenderer.invoke('delete', id);
// 		await getProducts();
// 	}

// 	return;
// }

// productForm.addEventListener('submit', async (e) => {
// 	e.preventDefault();
// 	const newProduct = {
// 		name: productName.value,
// 		price: productPrice.value,
// 		description: productDescription.value,
// 	}
// 	if (!editingStatus) {
// 		const result = await ipcRenderer.invoke('some', newProduct);
// 	} else {
// 		await ipcRenderer.invoke('editProduct', productId, newProduct);
// 		editingStatus = false;
// 		productId = '';
// 	}


// 	productForm.reset();
// 	productForm.focus();

// 	await getProducts();

// })

// const renderProducts = (products) => {
// 	productsList.innerHTML = '';
// 	products.forEach(product => {
// 		productsList.innerHTML += `
// 			<div class="card card-body my-2 animated fadeInLeft">
// 				<h4>${product.name}</h4>
// 				<p>${product.description}</p>
// 				<h3>${product.price}</h3>
// 				<p>
// 					<button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
// 						DELETE
// 					</button>
// 					<button class="btn btn-secondary" onclick="editProduct('${product.id}')">
// 						EDIT
// 					</button>
// 			</div>
// 		`
// 	})
// }

// const getProducts = async () => {
// 	const result = await ipcRenderer.invoke('get-products');
// 	renderProducts(result);
// }

// const editProduct = async (id) => {
// 	const product = await ipcRenderer.invoke('getProductById', id);
// 	productName.value = product.name;
// 	productPrice.value = product.price;
// 	productDescription.value = product.description;

// 	editingStatus = true;
// 	productId = product.id;
// }



// (async function init() {
// 	await getProducts();
// })();

