var config  = require('../config');

module.exports = (app) => {
    app.get('/admin', (request, response) => {
        getAdminData((error, data) => {
            if(error){
                console.log(error);
                response.status(500).end();
            }else{
                response.send(data);
            }
        }); 
    });
}

var getAdminData = (callback) => {
    config.MongoClient.connect(config.db_url, (error, db) => {
        if (error) return callback(error);

        db.collection('urls').find({}, (error, result) => {
            if (error) return callback(error);

            var stuff = "<p>Backend Page</p><p>Database:</p>";
            result.forEach((element) => {
                if(element != null){
                    stuff += (
                        "Key: " + element.key + " Url: " + element.url + "<br>"
                    );
                }
            }, (error) => {
                if (error) return callback(error);
                callback(null, stuff);
            });
        });
        db.close();
    });
}