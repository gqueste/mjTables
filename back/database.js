var mysql      = require('mysql');
module.exports = {
	connection: function(){
		return mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'password',
			database : 'mjtables'
		});
	}
}