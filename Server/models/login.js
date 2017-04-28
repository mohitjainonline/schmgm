var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
 

 // set up a mongoose model
var LoginSchema = new Schema({
    _id : {type: String,unique: true},
    token: {type: String,unique: false,required: true},
    ts: { type: Date, default: Date.now },
    expirein: { type: Number, default: 30 },
    active: { type: Boolean, default: true }
});


LoginSchema.pre('save', function (next) {
    var login = this;
    return next();    
});
module.exports = mongoose.model('Login', LoginSchema);