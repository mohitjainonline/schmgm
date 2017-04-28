var Login = require('../models/login'); // get the mongoose model
var jwt = require('jwt-simple');
var config = require('../../config/database');


module.exports = function(apiRoutes, passport) {
    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRoutes.post('/login/setup', function(req, res) {

        Login.findOne({
            '_id': req.body._id
        }, function(err, login) {
            if (err) throw err;

            if (!login) {
                res.send({ success: false, msg: 'Authentication failed. Loing not found.' });
            } else {
                // return the information including token as JSON
                res.json({ success: true, token: login.token, login_id: login._id });
            }
        });
    });
}