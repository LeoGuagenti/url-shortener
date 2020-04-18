var config  = require('../config');

// all url pins must be formated xxxxx88
module.exports = (app) => {
    app.get(/.*88$/, (request, response) => {       
        var path = request.originalUrl.substr(1);

        searchURL(path, (error, url_data) => {
            console.log(url_data);
            if(error){
                response.status(500).end();
             }else{
               response.redirect(url_data);
            }
        });
    });
}

var searchURL = (path, callback) => {
    config.MongoClient.connect(config.db_url, (error, db) => {
        if (error) return callback(error);

       db.collection("urls").find({"key": path}).toArray((error, result) => {
            if (error) return callback(error);
            
            callback(null, result[0].url);
            db.close();
        });
    });
}