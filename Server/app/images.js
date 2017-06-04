var User = require('../models/user'); // get the mongoose model
var jwt = require('jwt-simple');
var config = require('../../config/database');
var uuidV1 = require('uuid/v1');
var Images = require('../models/images');
module.exports = function(apiRoutes, passport) {
    // create a new user account (POST http://localhost:8080/api/signup)
    apiRoutes.post('/images/add', function(req, res) {
        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                token: decoded
            }, function(err, user) {
                if (err) {
                    return res.json({ success: false, msg: err });
                }
                if (!user) {
                    return res.status(403).send({ success: false, msg: 'Authentication failed.' });
                } else {
                    var query = { '_id': req.body._id };
                    Images.findOneAndUpdate(query, req.body, { upsert: true }, function(err, doc) {
                        if (err) {
                            return res.json({ success: false, msg: err });
                        }
                        return res.json({ success: true });
                    });
                }
            });
        } else {
            return res.status(403).send({ success: false, msg: 'No token provided.' });
        }
    });



}