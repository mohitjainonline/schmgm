var User = require('../models/user'); // get the mongoose model
var Login = require('../models/login'); // get the mongoose model
var jwt = require('jwt-simple');
var config = require('../../config/database');
var uuidV1 = require('uuid/v1');

module.exports = function(apiRoutes, passport) {
    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRoutes.post('/user/authenticate', function(req, res) {

        User.findOne({
            'params.email': req.body.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = 'JWT ' + jwt.encode(user.token, config.secret);

                        //enter login information

                        var newLogin = new Login({
                            _id: uuidV1(),
                            token: token
                        });
                        newLogin.save(function(err) {
                            if (err) {
                                return res.json({ success: false, msg: 'Error in login create.' });
                            }
                            // return the information including token as JSON
                            res.json({ success: true, token: token, login_id: newLogin._id });
                        });
                    } else {
                        res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                    }
                });
            }
        });
    });
}