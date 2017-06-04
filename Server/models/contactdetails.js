var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


// set up a mongoose model
var ContactDetailsSchema = new Schema({
    _id: { type: String, unique: true },
    uid: { type: String, required: true },
    type: { type: String, required: true },
    ts: { type: Date, default: Date.now },
    data: { type: String },
    default: { type: Boolean },
    active: { type: Boolean, default: true }
});


ContactDetailsSchema.pre('save', function(next) {
    var cd = this;
    return next();
});
module.exports = mongoose.model('ContactDetails', ContactDetailsSchema);