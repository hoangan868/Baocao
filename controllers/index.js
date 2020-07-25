const User = require('../models/user');
const Post = require('../models/post');
const Category = require('../models/category');
const passport = require('passport');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const moment = require('moment');

module.exports = {
	// GET /
	async landingPage(req, res, next) {
		const posts = await Post.find({ status: 1 });
		const postlimit = await Post.find({status:1}).sort('-_id');
		const category = await Category.find({status:1});
		res.render('index', { posts, postlimit ,category, mapBoxToken, title: 'Phòng trọ - Trang chủ' });
	},
	// GET /register
	async getRegister(req, res, next) {
		const category = await Category.find({status:1});
		res.render('register', { title: 'Register', username: '', email: '', category });
	},
	// POST /register
	async postRegister(req, res, next) {
		try {
			if (req.file) {
				const { secure_url, public_id } = req.file;
				req.body.image = { secure_url, public_id };
			}
			const user = await User.register(new User(req.body), req.body.password);
			user.createdAt = Date.now();
			req.login(user, function(err) {
				if (err) return next(err);
				req.session.success = `Welcome to Surf Shop, ${user.username}!`;
				res.redirect('/');
			});
		} catch(err) {
			deleteProfileImage(req);
			const { username, email } = req.body;
			let error = err.message;
			if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
				error = 'A user with the given email is already registered';
			}
			res.render('register', { title: 'Register', username, email, error });
		}
	},
	// GET /login
	async getLogin(req, res, next) {
		if (req.isAuthenticated()) return res.redirect('/');
		if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
		const category = await Category.find({status:1});
		res.render('login', { title: 'Login', category });
	},
	// POST /login
	async postLogin(req, res, next) {
		const { username, password } = req.body;
		const { user, error } = await User.authenticate()(username, password);
		if (!user && error) return next(error);
		req.login(user, function(err) {
			if (err) return next(err);
			req.session.success = `Welcome back, ${username}!`;
			const redirectUrl = req.session.redirectTo || '/';
			delete req.session.redirectTo;
			res.redirect(redirectUrl);
		});
	},
	// GET /logout
	getLogout(req, res, next) {
	  req.logout();
	  res.redirect('/');
	},
	async getProfile(req, res, next) {
		const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
		const category = await Category.find({status:1});
		res.render('profile', { posts, category, moment });
	},
	async updateProfile(req, res, next) {
		const {
			firstname,
			lastname,
			username,
			email,
			phone,
			tinh,
			huyen,
			xa,
			birthday,
			desc
		} = req.body;
		const { user } = res.locals;
		if (username) user.username = username;
		if (email) user.email = email;
		if (phone) user.phone = phone;
		if (firstname) user.firstname = firstname;
		if (lastname) user.lastname = lastname;
		if (tinh) user.tinh = tinh;
		if (huyen) user.huyen = huyen;
		if (xa) user.xa = xa;
		if (birthday) user.birthday = birthday;
		if (desc) user.desc = desc
		if (req.file) {
			if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
			const { secure_url, public_id } = req.file;
			user.image = { secure_url, public_id };
		}
		console.log(user);
		await user.save();
		const login = util.promisify(req.login.bind(req));
		await login(user);
		req.session.success = 'Profile successfully updated!';
		res.redirect('/profile');
	},
	async getForgotPw(req, res, next) {
		const category = await Category.find({status:1});
		res.render('users/forgot',{category});
	},
	async putForgotPw(req, res, next) {
		const token = await crypto.randomBytes(20).toString('hex');
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			req.session.error = 'No account with that email.';
			return res.redirect('/forgot-password');
		}
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		const msg = {
		  to: email,
		  from: 'Surf Shop Admin <your@email.com>',
		  subject: 'Surf Shop - Forgot Password / Reset',
		  text: `You are receiving this because you (or someone else)
		  have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it
			into your browser to complete the process:
			http://${req.headers.host}/reset/${token}
			If you did not request this, please ignore this email and
			your password will remain unchanged.`.replace(/		  /g, ''),
		  // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		};
		await sgMail.send(msg);

		req.session.success = `An email has been sent to ${email} with further instructions.`;
		res.redirect('/forgot-password');
	},
	async getReset(req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			req.session.error = 'Password reset token is invalid or has expired.';
			return res.redirect('/forgot-password');
		}

		res.render('users/reset', { token });
	},
	async putReset(req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			req.session.error = 'Password reset token is invalid or has expired.';
			return res.redirect('/forgot-password');
		}

		if (req.body.password === req.body.confirm) {
			await user.setPassword(req.body.password);
			user.resetPasswordToken = null;
			user.resetPasswordExpires = null;
			await user.save();
			const login = util.promisify(req.login.bind(req));
			await login(user);
		} else {
			req.session.error = 'Passwords do not match.';
			return res.redirect(`/reset/${ token }`);
		}

		const msg = {
	    to: user.email,
	    from: 'Surf Shop Admin <your@email.com>',
	    subject: 'Surf Shop - Password Changed',
	    text: `Hello,
		  This email is to confirm that the password for your account has just been changed.
		  If you did not make this change, please hit reply and notify us at once.`.replace(/		  /g, '')
	  };

	  await sgMail.send(msg);

	  req.session.success = 'Password successfully updated!';
	  res.redirect('/');
	},
	async getUserLanding(req,res,next){
		const posts = await Post.find().where('author').equals(req.user._id).sort('-_id');
		const category = await Category.find({status:1});
		res.render('users/index', {category, posts, moment});
	},
	async updatePost(req,res,next){
		
		const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
		const category = await Category.find({status:1});
		res.render('users/index', {category, posts});
	}
}









