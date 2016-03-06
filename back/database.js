var mysql      = require('mysql');
module.exports = {
	connection: function(){
		if(process.env.CLEARDB_DATABASE_URL){
			var address = process.env.CLEARDB_DATABASE_URL.toString();
			var tab1 = address.split('://');
			var tab2 = tab1[1].split(':');
			var user = tab2[0];
			var tab3 = tab2[1].split('@');
			var password = tab3[0];
			var tab4 = tab3[1].split('/');
			var host = tab4[0];
			var tab5 = tab4[1].split('?');
			var database = tab5[0];


			return mysql.createConnection({
				connectionLimit : 10,
				host     : host,
				user     : user,
				password : password,
				database : database
			});
		}
		else{
			return mysql.createPool({
				connectionLimit : 10,
				host     : 'localhost',
				user     : 'root',
				password : 'admin',
				database : 'mjtables'
			});
		}
	}
};
