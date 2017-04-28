var User        = require('../models/user'); // get the mongoose model
var jwt         = require('jwt-simple');
var config      = require('../../config/database');

module.exports = function(apiRoutes,passport){

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
// ...
 
// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/user/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  

  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      token: decoded
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.',user : {}});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.params.email + '!' , user : user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
 
getToken = function (headers) {
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