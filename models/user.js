const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	image:  {
		secure_url: { type: String, default: '/images/default-profile.jpg' },
		public_id: String
	},
	birthday: String,
	phone: Number,
	role: String,
	desc:String,
	tinh:String,
	huyen:String,
	xa:String,
	firstname:String,
	lastname:String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	createAt: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
