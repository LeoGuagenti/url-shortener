var MongoClient = require('mongodb').MongoClient({ useInifiedTopology: true } );
const db_url = 'mongodb://127.0.0.1:27017/urls_db';
const chars = "abcdefghijklmnopqrstuvwkyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const host = 'localhost';

exports.handleInsertion = function (new_url, callback){
    MongoClient.connect(db_url, function(error, db){
        if (error) return callback(error);

        //generate url key
        var url_key = '';
        var redoKey = true;
        do{
            //generate 6 character key
            url_key = generateKey();
            //console.log(`URL key: ${url_key}`);
            
            db.collection('urls').find({"key": url_key}, function(error, result){
                if (error) return callback(error);

                console.log(result[0]);

                if(result[0] === undefined){
                    redoKey = false;
                }
            });
        }while(redoKey);

        db.collection('urls').insertOne({key: url_key, url: new_url}, function(error){
            if (error) return callback(error);

            console.log(`Inserted: ${new_url} under thet key ${url_key}`);
        });

        callback(null, {key: url_key, url: new_url, host: host});
        db.close(); 
    });
}

function generateKey(){
    var url_key = '';
    for(var i = 0; i <= 5; i++){
        url_key += chars[Math.floor(Math.random() * chars.length)];
    }
    return url_key + "88";
}