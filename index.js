var http = require('http'),
    fs = require('fs'),
    sql = require('mysql');

const login = require('./sql_login.js');
const handler = require('./handle_url.js');

// SQL Connection
var connection = sql.createConnection(login);

// Server 
http.createServer(function(req, res){
    if(req.method == 'POST'){
        var data = '';
        req.on('data', function(chunk){
            data += chunk;
        });

        console.log(data);
        req.on('end', function(){
            handler.handleURL(data);
        });
    }
    
    var path_url = req.url;

    if(path_url === '/favicon.ico'){
        //ignore favicon request
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }
    
    else if(path_url === '/'){
        //displaying default screen URL converter
        fs.readFile('./src/index.html', function(error, data){
            res.write(data);
            res.end();
        });
        return;
    }
    
    else{
        path_url = path_url.slice(1);
        var command = `SELECT urls.original_url FROM urls WHERE urls.key='${path_url}'`;
        
        connection.query(command, function(error, result){
            if(error){
                return console.log("An error occured while querying for a the keys corresponding url");
            }
            
            if(result[0] === undefined){
                fs.readFile('./src/missingPage.html', function(err, data){
                    res.write(data);
                    res.end();
                });
            }else{
                res.writeHead(301, {
                    Location: result[0].original_url
                });
                res.end();
            }
        });
    }
}).listen(8080);