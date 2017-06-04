var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


// set up a mongoose model
var ImagesSchema = new Schema({
    _id: { type: String, unique: true },
    uid: { type: String, required: true },
    imageType: { type: String, required: true },
    catagory: { type: String },
    ts: { type: Date, default: Date.now },
    data: { type: String },
    active: { type: Boolean, default: true }
});


ImagesSchema.pre('save', function(next) {
    var img = this;
    return next();
});
module.exports = mongoose.model('Images', ImagesSchema);