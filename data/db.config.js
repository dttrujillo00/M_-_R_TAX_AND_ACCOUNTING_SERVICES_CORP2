const sqlite = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite.Database(path.join(__dirname, './data.db'), (err) => {
	if (err) {
		console.log(err);
	}

});

db.on('open', () => {
	console.log('database open');
	// db.run('CREATE TABLE IF NOT EXISTS product(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL)');
})

db.on('close', () => {
	db.close();
})

db.query = function (sql, params) {
	params = params || [];
	let that = this;
	return new Promise((resolve, reject) => {
		that.all(sql, params, function (error, rows) {
			console.log(sql, rows);
			if (error)
				reject(error);
			else
				resolve(rows);
		})
	})
};