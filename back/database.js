var mysql      = require('mysql');
module.exports = {
	connection: function(){
		if(process.env.DATABASEADDRESS){
			return mysql.createConnection(process.env.DATABASEADDRESS);
		}
		else{
			return mysql.createConnection({
				host     : 'localhost',
				user     : 'root',
				password : 'password',
				database : 'mjtables'
			});
		}
	}
};