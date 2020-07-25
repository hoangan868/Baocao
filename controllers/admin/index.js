const User = require('../../models/user');
const Post = require('../../models/post');
const Category = require('../../models/category');
const ReviewKV = require('../../models/reviewKV');
const ReviewKV2 = require('../../models/reviewKV2');
const ReviewKV3 = require('../../models/reviewKV3');
const passport =require('passport');
const util = require('util');
const { cloudinary } = require('../../cloudinary');
const { deleteProfileImage } = require('../../middleware');
const crypto = require('crypto');
const moment = require('moment');
module.exports = {
    //GET /
    async adminPage(req,res,next) {
        const posts = await Post.find();
        const post = await Post.find().sort('-_id').limit(5);
        const user = await User.find().sort('-_id').limit(5);
        res.render('admin/index',{posts,post,user});
    },
    getLoginAdmin(req,res,next) {
        res.render('admin/login', {title: 'Login admin'});
    },
    async getCate(req,res,next){
        let cates = await Category.find();
        res.render('admin/category/cate',{cates});
    },
    newCategory(req,res,next){
        res.render('admin/category/newCate');
    },
    async PostNewCate(req,res,next){
        let cate = await Category.create(req.body.category);
        cate.save();
        req.session.success = 'Cate created successfully!';
		res.redirect('/admin/category');
    },
    async cateShow(req, res, next) {
		let cate = await Category.findById(req.params.id);
		// const floorRating = post.calculateAvgRating();
		res.render('admin/category/showcate', { cate });
    },
    async cateEdit(req, res, next) {
        let cate = await Category.findById(req.params.id);
        res.render('admin/category/cateEdit',{cate});
    },
    async cateUpdate(req,res,next){
        let cate = await Category.findById(req.params.id);
        cate.name = req.body.cate.name;
        cate.status = req.body.cate.status;
        cate.save();
        res.redirect(`/admin/category/${cate.id}`);
    },
    async cateDestroy(req,res,next){
        let cate = await Category.findById(req.params.id);
        await cate.remove();
        res.redirect('/admin/category');

    },
    async postLoginAdmin(req,res,next){
        const { username,password } = req.body;
        const { user, error } = await User.authenticate()(username, password);
        if (!user && error) return next(error);
        if (user.role == 'absd' || user.role == 'anab' ) { 
            req.login(user, function(err){
                if(err) return next(err);
                req.session.success = `Welcome back, ${username}!`;
                const redirectUrl = req.session.redirectTo || '/admin/landing';
                delete req.session.redirectTo;
                res.redirect(redirectUrl);
            });
        }
        req.session.error = 'tai khoan khong hop le, chi admin or quan tri vien';
        res.redirect('/admin');
        
    },
    getLogoutAdmin(req,res,next){
        req.logout();
        res.redirect('/admin');
    },
    async getUser(req,res,next){
        let users = await User.find();
        res.render('admin/user/index',{users,moment});
    },
    //tphcm bd tay ninh
    async getKhuVuc(req,res,next){
        let rekv = await ReviewKV.find();
        res.render('admin/khuvuc/kv',{rekv});
    },
    newKhuVuc(req,res,next){
        res.render('admin/khuvuc/new');
    },
    async PostNewKhuVuc(req,res,next){
        req.body.reviewkv.images = [];
		for(const file of req.files) {
			req.body.reviewkv.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
        }
        req.body.reviewkv.url = req.body.reviewkv.images[0].url;
        let kv = await ReviewKV.create(req.body.reviewkv);
        kv.save();
        req.session.success = 'kv created successfully!';
		res.redirect('/admin/khuvuc');
    },
    // quan 1, quan 2
    async getKhuVuc2(req,res,next){
        let kv = await ReviewKV2.find();
        console.log(kv);
        res.render('admin/khuvuc/kv2',{kv});
    },
    newKhuVuc2(req,res,next){
        res.render('admin/khuvuc/new2');
    },
    async PostNewKhuVuc2(req,res,next){
        req.body.reviewkv2.images = [];
		for(const file of req.files) {
			req.body.reviewkv2.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
        }
        req.body.reviewkv2.url = req.body.reviewkv2.images[0].url;
        let kv = await ReviewKV2.create(req.body.reviewkv2);
        kv.save();
        req.session.success = 'kv created successfully!';
		res.redirect('/admin/khuvuc/');
    },
    async KV2Show(req, res, next) {
		let kv = await ReviewKV2.findById(req.params.id);
		// const floorRating = post.calculateAvgRating();
		res.render('admin/khuvuc/showkv2', { kv });
    },
    async KV2Edit(req, res, next) {
        let kv = await ReviewKV2.findById(req.params.id);
        res.render('admin/khuvuc/kv2Edit',{kv});
    },
    async KV2Update(req,res,next){
        let kv2Update = await ReviewKV2.findById(req.params.id);
        kv2Update.name = req.body.kv2.name;
        kv2Update.save();
        res.redirect(`/admin/khuvuc/${kv2Update.id}`);
    },
    //phuong da kao
    async getKhuVuc3(req,res,next){
        const kvend = await ReviewKV3.find();
        console.log(kvend.length);
        res.render('admin/khuvuc/kv3',{kvend});
    },
    newKhuVuc3(req,res,next){
        res.render('admin/khuvuc/new3');
    },
    async PostNewKhuVuc3(req,res,next){
        req.body.reviewkv3.images = [];
		for(const file of req.files) {
			req.body.reviewkv3.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
        }
        req.body.reviewkv3.url = req.body.reviewkv3.images[0].url;
        let kv = await ReviewKV3.create(req.body.reviewkv3);
        kv.save();
        req.session.success = 'kv created successfully!';
		res.redirect('/admin/khuvuc/kv3');
    },
    async getRoom(req,res,next){
        const post = await Post.find();
        res.render('admin/room/phong',{post,moment});
    },
    async roomEdit(req,res,next){
        let post = await Post.findById(req.params.id);
        console.log(req.params.id);
        res.render('admin/room/phongEdit',{post});
    },
    async phongUpdate(req,res,next){
        let post = await Post.findById(req.params.id);
        post.status = req.body.phong.status;
        post.save();
        res.redirect(`/admin/room/`);
    },
}
