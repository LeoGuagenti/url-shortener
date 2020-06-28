# URL Shortener
This project is a small localhost url shortener made using `MongoDB`, `Express`, and `NodeJS`. <br>
I am using this project to become more aquainted with databases and backend development.<br><br>

To Run this application, you must have a `MongoDB` server and `NodeJS` installed. 
### Start The MongoDB
Navigate to the mongo bin folder wherever you installed the mongo server on your machine and run the command:
```shell
mongo
```
In order for the url shortener to work properly, you should have a db on your server named `urls_db` and a collection within that db named `urls`

### Running The Application
In the root directory of this project, run the command: 
```shell
node index.js
```
Now the application should be up and running on `localhost:8080`. You may change the MongoDB connection data inside of `config.js`
