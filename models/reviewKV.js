const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewKVSchema = new Schema({
    name: String,
    status: String,
    slug:String,
    images: [ { url: String, public_id: String } ],
    url: String
});

module.exports = mongoose.model('reviewKV', ReviewKVSchema);