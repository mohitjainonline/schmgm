var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database'); // get db config file
var port = process.env.PORT || 8085;

module.exports = function(apiRoutes) {

    // get our request parameters
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    app.use(bodyParser.json({ limit: '50mb' }));

    // log to console
    app.use(morgan('dev'));

    // Use the passport package in our application
    app.use(passport.initialize());

    // Add headers
    app.use(function(req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });





    // demo Route (GET http://localhost:8080)
    app.get('/', function(req, res) {
        res.send('Hello! The API is at http://localhost:' + port + '/api');
    });



    // Start the server
    app.listen(port);
    console.log('There will be dragons: http://localhost:' + port);
    // demo Route (GET http://localhost:8080)
    // ...

    // connect to database
    mongoose.connect(config.database);

    // pass passport for configuration
    require('../config/passport')(passport);

    // bundle our routes
    var apiRoutes = express.Router();

    var memberinfo = require('../Server/app/memberinfo')(apiRoutes, passport);
    var authentication = require('../Server/app/authentication')(apiRoutes, passport);
    var user = require('../Server/app/user')(apiRoutes, passport);
    var login = require('../Server/app/login')(apiRoutes, passport);
    var cd = require('../Server/app/contactdetails')(apiRoutes, passport);
    var img = require('../Server/app/images')(apiRoutes, passport);




    // connect the api routes under /api/*
    app.use('/api', apiRoutes);


}