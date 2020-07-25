const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: String,
    status: String,
    slug:String
});

module.exports = mongoose.model('Category', CategorySchema);