var MongoClient = require('mongodb').MongoClient({ useInifiedTopology: true } );
var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser');

var handler = require('./handleInsertion.js');

var app = express();  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db_url = 'mongodb://127.0.0.1:27017/urls_db';
const port = 8080;

app.get('/', function(request, response){
    fs.readFile('./src/index.html', function(error, data){
        if (error) throw error;

        response.write(data);
        response.end();
    });
});

app.get('/~admin', function(request, response){
    getAdminData(function(error, data){
        if(error){
            console.log(error);
            response.status(500).end();
        }else{
            response.send(data);
        }
    }); 
});

function getAdminData(callback){
    MongoClient.connect(db_url, function(error, db){
        if (error) return callback(error);

        db.collection('urls').find({}, function(error, result){
            if (error) return callback(error);

            var stuff = "<p>Backend Page</p><p>Database:</p>";
            result.forEach(function(element) {
                if(element != null){
                    stuff += (
                        "Key: " + element.key + " Url: " + element.url + "<br>"
                    );
                }
            }, function(error){
                if (error) return callback(error);
                callback(null, stuff);
            });
        });
        db.close();
    });
}

// all url pins must be formated xxxxx88
app.get(/.*88$/, function(request, response){
    var path = request.originalUrl.substr(1);
    console.log(path);
    searchURL(path, function(error, url_data){
        console.log(url_data);
        if(error){
            response.status(500).end();
        }else{
            response.redirect(url_data);
        }
    });
});

function searchURL(path, callback){
    MongoClient.connect(db_url, function(error, db){
        if (error) return callback(error);

       db.collection("urls").find({"key": path}).toArray(function(error, result) {
            if (error) return callback(error);
            
            callback(null, result[0].url);
            db.close();
        });
    });
}

app.get('*', function(request, response){
    fs.readFile('./src/missingPage.html', function(error, data){
        if (error) throw error;

        response.write(data);
        response.end();
    });
});

app.post('/', function(request, response){
    const new_url = request.body.input_url;
    
    handler.handleInsertion(new_url, function(error, data){
        if(error){
            console.log('Item insertion failed');
            response.status(500).end();
        }else{
            response.write(`You're url '${data.url}' is now available at ${data.host}:${port}/${data.key}`);
            response.end();
        }
    })
});

app.listen(port, function(){});