const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewKV2Schema = new Schema({
    name: String,
    status: String,
    slug:String,
    images: [ { url: String, public_id: String } ],
    fathername:String,
    url: String,
    school:Number,
    adress:Number,
    kv3:Number,
});

module.exports = mongoose.model('reviewKV2', ReviewKV2Schema);