var User = require('../models/user'); // get the mongoose model
var jwt = require('jwt-simple');
var config = require('../../config/database');
var Profile = require('../models/profile');
var Images = require('../models/images');
var uuidV1 = require('uuid/v1');
module.exports = function(apiRoutes, passport) {

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    // ...

    // route to a restricted info (GET http://localhost:8080/api/memberinfo)
    apiRoutes.get('/user/memberinfo', passport.authenticate('jwt', { session: false }), function(req, res) {

        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                token: decoded
            }, function(err, user) {
                if (err) throw err;
                if (!user) {
                    return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.', user: {} });
                } else {
                    Images.findOne({
                        uid: user._id,
                        imageType: "Profile"
                    }, function(err, image) {
                        if (err) throw err;
                        if (!image) {
                            var newImage = {
                                _id: uuidV1(),
                                uid: user._id,
                                imageType: "Profile"
                            }
                            getProfileData(req, res, user, newImage);
                        } else {
                            getProfileData(req, res, user, image);

                        }
                    });
                }
            });
        } else {
            return res.status(403).send({ success: false, msg: 'No token provided.' });
        }
    });




    // create a new user account (POST http://localhost:8080/api/signup)
    apiRoutes.post('/user/profilesave', function(req, res) {
        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                token: decoded
            }, function(err, user) {
                if (err) {
                    return res.json({ success: false, msg: err });
                };
                if (!user) {
                    return res.status(403).send({ success: false, msg: 'Authentication failed.', user: {} });
                } else {
                    var query = { '_id': req.body._id };
                    Profile.findOneAndUpdate(query, req.body, { upsert: true }, function(err, doc) {
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

    // route to a restricted info (GET http://localhost:8080/api/memberinfo)
    apiRoutes.get('/user/getUsers', passport.authenticate('jwt', { session: false }), function(req, res) {
        console.log(req.query)

        var token = getToken(req.headers);
        if (token) {

            User.find({
                role: req.query.role
            }, function(err, users) {
                if (err) throw err;
                res.json({ success: true, users: users });
            });
        } else {
            return res.status(403).send({ success: false, msg: 'No token provided.' });
        }
    });


    getProfileData = function(req, res, user, image) {
        if (req.query.profiletype) {
            Profile.findOne({
                uid: user._id,
                profiletype: req.query.profiletype
            }, function(err, profile) {

                if (err) throw err;
                if (!profile) {
                    var newprofile = {
                        _id: uuidV1(),
                        uid: user._id,
                        profiletype: req.query.profiletype,
                        name: user.name
                    }
                    profile = newprofile;
                    res.json({
                        success: true,
                        user: user,
                        profile: newprofile,
                        image: image
                    });

                } else {
                    res.json({ success: true, user: user, profile: profile, image: image });
                }
            });
        } else {
            res.json({ success: true, user: user, image: image });
        }
    }


    getToken = function(headers) {
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
}