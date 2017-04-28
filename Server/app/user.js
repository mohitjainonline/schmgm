var User = require('../models/user'); // get the mongoose model
var jwt = require('jwt-simple');
var config = require('../../config/database');
var uuidV1 = require('uuid/v1');
module.exports = function(apiRoutes, passport) {
    // create a new user account (POST http://localhost:8080/api/signup)
    apiRoutes.post('/user/signup', function(req, res) {
        if (!req.body.email || !req.body.password) {
            res.json({ success: false, msg: 'Please pass email and password.' });
        } else {
            var newUser = new User({
                _id: uuidV1(),
                token: uuidV1(),
                role: "school-admin",
                params: {
                    email: req.body.email,
                    password: req.body.password
                }
            });

            // save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({ success: false, msg: 'Email already exists.' });
                }
                res.json({ success: true, msg: 'Successful created new user.' });
            });
        }
    });



    // create a new user account (POST http://localhost:8080/signup)
    // ...
}