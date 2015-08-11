var mysql      = require('mysql');
module.exports = {
	connection: function(){
		if(process.env.CLEARDB_DATABASE_URL){
			return mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
		}
		else{
			return mysql.createConnection({
				host     : 'localhost',
				user     : 'root',
				password : 'admin',
				database : 'mjtables'
			});
		}
	}
};