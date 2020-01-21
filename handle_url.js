var sql = require('mysql'),
    login = require('./sql_login.js');

const chars = "abcdefghijklmnopqrstuvwkyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  
  
exports.handleURL = function(content){
	var connection = sql.createConnection(login);
}  
  
  
  
    //should pass data
exports.handleURL = function(content){    
    var connection = sql.createConnection(login);
    //check if url is valid
    //eg http://www.site.com
    // could determine if is valid site if ping responds

    //generate key
    var url_key, query;
    var redoKey = true;
    do{
        // generate 6 character key
        url_key = '';
        for(var i = 0; i <= 5; i++){
            url_key += chars[Math.floor(Math.random() * chars.length)];
        }

        console.log(`URL key: ${url_key}`);

        // make sure key isnt in db
		
		//TROUBLE AREA
        query = `SELECT COUNT(1) FROM urls WHERE urls.key=${url_key}`;
        connection.query(query, function(error, result){
            console.log('am i even getting here');
            console.log(result);
            if (error){
                return console.log("SQL> An Error occured");
            }else if(result[0] === 0){
                redoKey = false;
            }
        });
    }while(redoKey);

    // insert ket url pair into db
    query = `INSERT INTO urls (${url_key}, ${content})`;
    connection.query(query, function(error, result){
        if(error){
            return console.log("SQL> An Error occured");
        }
        console.log('added to db');
    });
}