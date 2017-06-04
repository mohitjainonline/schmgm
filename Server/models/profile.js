var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


// set up a mongoose model
var ProfileSchema = new Schema({
    _id: { type: String, unique: true },
    uid: { type: String, required: true },
    profiletype: { type: String, required: true },
    ts: { type: Date, default: Date.now },
    name: { type: String },
    dob: { type: Date },
    gender: { type: String },
    active: { type: Boolean, default: true }
});


ProfileSchema.pre('save', function(next) {
    var profile = this;
    return next();
});
module.exports = mongoose.model('Profile', ProfileSchema);