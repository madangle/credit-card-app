const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

//enable cors
app.use(cors());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

function validateLuhn(cardNumber){
    console.log(cardNumber);
    var cardLength = cardNumber.length;
    var nSum = 0;
    var isSecond = false;

    for (var i = cardLength - 1; i >= 0; i-- ){
        var d = parseInt(cardNumber.charAt(i)) - 0;
        if(isSecond){
            d = d * 2;
        }
        nSum += d/10;
        nSum += d % 10;
        
        isSecond = !isSecond;
    }
    console.log((nSum % 10 == 0) ? "Valid" : "invalid");
    return (nSum % 10 == 0);
}
validateLuhn("4916463101684210");
// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('./app/routes/card.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});