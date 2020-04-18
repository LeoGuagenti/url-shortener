var config  = require('../config'),
    fs      = require('fs');

module.exports = (app) => {
    app.get('*', (request, response) => {
        fs.readFile('./endpoints/missingPage.html', (error, data) => {
            if (error) throw error;
    
            response.write(data);
            response.end();
        });
    });
}
