var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var UserSchema = new Schema({
    _id: { type: String, unique: false, required: true },
    token: { type: String, unique: false, required: true },
    ts: { type: Date, default: Date.now },
    role: { type: String },
    params: {
        name: { type: String, required: false },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        city: { type: String, required: false }
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.params.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.params.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.params.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);