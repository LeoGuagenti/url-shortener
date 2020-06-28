var MongoClient = require('mongodb').MongoClient({ useUnifiedTopology: true } );

module.exports = config = {
    db_url: 'mongodb://127.0.0.1:27017/urls_db',
    host: 'localhost',
    port: 8080,
    MongoClient: MongoClient
};
