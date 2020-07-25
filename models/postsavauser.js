const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSaveSchema = new Schema({
    postID:String,
    userID:String
});

module.exports = mongoose.model('postsave', PostSaveSchema);