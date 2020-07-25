const Cate = require('../models/category');
const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const moment = require('moment');

module.exports = {
// Reviews Create
    async getCateNew(req, res, next) {
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery;
        const category = await Cate.find({status:1});
        let categori = await Cate.findById(req.params.id);
        console.log(categori.name);
        let posts = await Post.find({cate: categori.name, status: 1}).sort('-_id');
        res.render('category/index', {posts, category, moment, categori});
    },
    async search(req,res,next){
        var query = require('url').parse(req.url,true).query;
        var arr = [];
        const cate = query.cate;
        const tinh = query.tinh;
        const huyen = query.huyen;
        const xa = query.xa;
        const min = query.min * 100000;
        const max = query.max * 100000;
        let categori = await Cate.find({name:cate});
        const category = await Cate.find({status:1});
        const posts = await Post.find({cate:cate, state:xa, price: { $gt : min  , $lt : max }});
        res.render('category/search', {posts,category, moment, categori,tinh,huyen,xa});
    },
    test(req,res,next){
        
        res.render('category/test');
    }
}




