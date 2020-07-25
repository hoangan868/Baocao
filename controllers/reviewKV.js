const Post = require('../models/post');
const Category = require('../models/category');
const Reviewkv = require('../models/reviewKV');
const Reviewkv2 = require('../models/reviewKV2');
const Reviewkv3 = require('../models/reviewKV3');
const moment = require('moment');

module.exports = {
	async getListAdress(req,res,next){
        const category = await Category.find({status:1});
        const rekv = await Reviewkv.find({status:1});
        console.log(rekv.length);
		res.render('discove/listadress', {category,rekv});
    },
    async getListAdressSecond(req,res,next){
        const category = await Category.find({status:1});
        const rekv = await Reviewkv.find({status:1});
        const rvkv = await Reviewkv.find({slug:req.params.slug});
        const rekv2 = await Reviewkv2.find({fathername:rvkv[0].name});
        console.log(rekv2[0].slug);
        res.render('discove/listadress2',{category,rvkv,rekv2});
    },
    async getListAdressThird(req,res,next){
        const category = await Category.find({status:1});
        const rekv = await Reviewkv.find({name:req.params.fathername});
        const rekv2 = await Reviewkv2.find({slug:req.params.slug});
        const rekv3 = await Reviewkv3.find({fathername:rekv2[0].name});
        const post = await Post.find({provice:rekv2[0].name});
        res.render('discove/listadress3',{category,post, rekv, rekv2, rekv3});
    },
    async getListPost(req,res,next){
        const category = await Category.find({status:1});
        const rekv2 = await Reviewkv2.find({slug:req.params.slug});
        
        const rekv3 = await Reviewkv3.find();
        const posts = await Post.find({provice:rekv2[0].name});
        res.render('discove/listpost',{category,posts, rekv2,moment});
    }
}










