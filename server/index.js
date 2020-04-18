var config      = require('./config.js'),
    express     = require('express');
    bodyParser  = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/home')(app);
require('./routes/admin')(app);
require('./routes/shortened')(app);
require('./routes/notfound')(app);

app.listen(config.port, () => {
    console.log(`Server running at ${config.host}:${config.port}`);
});