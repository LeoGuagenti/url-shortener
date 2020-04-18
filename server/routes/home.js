var config  = require('../config'),
    fs      = require('fs');

const chars = "abcdefghijklmnopqrstuvwkyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

module.exports = (app) => {
    app.get('/', (request, response) => {
        fs.readFile('./endpoints/index.html', (error, data) => {
            if (error) throw error;

            response.write(data);
            response.end();
        });
    });

    app.post('/', (request, response) => {
        const new_url = request.body.input_url;
        
        handleInsertion(new_url, (error, data) => {
            if(error){
                console.log('Item insertion failed');
                response.status(500).end();
            }else{
                response.write(`You're url '${data.url}' is now available at ${data.host}:${config.port}/${data.key}`);
                response.end();
            }
        })
    });
}

var handleInsertion = (new_url, callback) => {
    config.MongoClient.connect(config.db_url, (error, db) => {
        if (error) return callback(error);

        //generate url key
        var url_key = '';
        var redoKey = true;
        do{
            //generate 6 character key
            url_key = generateKey();
            //console.log(`URL key: ${url_key}`);
            
            db.collection('urls').find({"key": url_key}, (error, result) => {
                if (error) return callback(error);

                console.log(result[0]);

                if(result[0] === undefined){
                    redoKey = false;
                }
            });
        }while(redoKey);

        db.collection('urls').insertOne({key: url_key, url: new_url}, (error) => {
            if (error) return callback(error);

            console.log(`Inserted: ${new_url} under thet key ${url_key}`);
        });

        callback(null, {key: url_key, url: new_url, host: config.host});
        db.close(); 
    });
}

var generateKey = () => {
    var url_key = '';
    for(var i = 0; i <= 5; i++){
        url_key += chars[Math.floor(Math.random() * chars.length)];
    }
    return url_key + "88";
}