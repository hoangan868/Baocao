const Post = require('../models/post');
const User = require('../models/user');
const Category = require('../models/category');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const moment = require('moment');

module.exports = {
	// Posts Index
	async postIndex(req, res, next) {
		const { dbQuery } = res.locals;
		delete res.locals.dbQuery;
		console.log(dbQuery);
		const qry = Post.find({ status: 1 });
		const category = await Category.find({status:1});
		let posts = await Post.paginate(dbQuery, {
			page: req.query.page || 1,
			limit: 10,
			sort: '-_id'
		});
		posts.page = Number(posts.page);
		if (!posts.docs.length && res.locals.query) {
			res.locals.error = 'No results match that query.';
		}
		res.render('posts/index', { 
			posts,
			category,
			mapBoxToken, 
			title: 'Posts Index' 
		});
		
	},
	// Posts New
	async postNew(req, res, next) {
		const category = await Category.find({status:1});
		res.render('posts/new', {category});
	},
	// Posts Create
	async postCreate(req, res, next) {
		const category = await Category.find({status:1});
		req.body.post.images = [];
		for(const file of req.files) {
			req.body.post.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		var lng = parseFloat(req.body.long);
		let lat = parseFloat(req.body.lat);
		let response = await geocodingClient
		  .reverseGeocode({
			query: [lng, lat]
		  })
		  .send();
		req.body.post.url = req.body.post.images[0].url;
		req.body.post.geometry = response.body.features[0].geometry;
		req.body.post.author = req.user._id;
		req.body.post.avgRating = 0;
		req.body.post.createdAt = moment({});
		let post = new Post(req.body.post);
		post.properties.description = 
		`<strong><a href="/posts/${post._id}">${post.title}</a></strong>
		<p>Địa chỉ: ${post.adress}</p><p>Giá:${post.price} vnđ</p>
		<p>Đối tượng: ${post.sex}</p><img style="width:100%" src="${post.images[0].url}"></img>`;//${post.description.substring(0, 20)}...
		post.save();
		// console.log(req.body.post);
		req.session.success = 'Post created successfully!';
		res.redirect(`/posts/${post.id}`,{category});
	},
	// Posts Show
	async postShow(req, res, next) {
		let post = await Post.findById(req.params.id).populate({
			path: 'reviews',
			options: { sort: { '_id': -1 } },
			populate: {
				path: 'author',
				model: 'User'
			}
		});
		const category = await Category.find({status:1});
		const cateid = await Category.find({name: post.cate});
		const userinfo = await User.findById(post.author);
		const postPlus = await Post.find({cate: post.cate}).sort('-_id');
		console.log(postPlus.length);
		// for(var i =0;i<postPlus.length;i++){
		// 	if(postPlus[i].title == post.title)
		// 	continue;
		// 	console.log(postPlus[i].title);
		// }
		post.view += 1;
		post.save();
		// const floorRating = post.calculateAvgRating();
		const floorRating = post.avgRating;
		res.render('posts/show', { post, mapBoxToken, floorRating, moment, category, cateid, userinfo, postPlus });
	},
	// Posts Edit
	async postEdit(req, res, next) {
		const category = await Category.find({status:1});
		const post = await Post.findById(req.params.id);
		res.render('posts/edit', {category,post});
	},
	// Posts Update
	async postUpdate(req, res, next) {
		// destructure post from res.locals
		const { post } = res.locals;
		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				// delete image from post.images
				for(const image of post.images) {
					if(image.public_id === public_id) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are any new images for upload
		if(req.files) {
			// upload images
			for(const file of req.files) {
				// add images to post.images array
				post.images.push({
					url: file.secure_url,
					public_id: file.public_id
				});
			}
		}
		// check if location was updated
		// if(req.body.post.location !== post.location) {
		// 	let response = await geocodingClient
		// 	  .forwardGeocode({
		// 	    query: req.body.post.location,
		// 	    limit: 1
		// 	  })
		// 	  .send();
		// 	post.geometry = response.body.features[0].geometry;
		// 	post.location = req.body.post.location;
		// }
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.city = req.body.post.city;
		post.provice = req.body.post.provice;
		post.state = req.body.post.state;
		post.homenum = req.body.post.homenum;
		post.adress = req.body.post.adress;
		post.cate = req.body.post.cate;
		post.dt = req.body.post.dt;
		post.people = req.body.post.people;
		post.waterPrice = req.body.post.waterPrice;
		post.electricPrice = req.body.post.electricPrice;
		post.price = req.body.post.price;
		post.url = post.images[0].url;
		console.log(req.body);
		post.properties.description = `
		<strong><a href="/posts/${post._id}">${post.title}</a></strong>
		<p style="margin-bottom:0"><span>Địa chỉ:</span><span>${post.adress}</span></p>
		<p style="margin-bottom:0">Giá: <span style="color:red">${post.price} VNĐ</span></p>
		<p style="margin-bottom:0">Đối tượng: ${post.sex}</p>
		<p style="margin-bottom:0"><img src="${post.images[0].url}" style="width:100%;height:200px" /></p>`;//${post.description.substring(0, 20)}...
		// save the updated post into the db
		//console.log(post)
		await post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},
	// Posts Destroy
	async postDestroy(req, res, next) {
		const { post } = res.locals;
		for(const image of post.images) {
			await cloudinary.v2.uploader.destroy(image.public_id);
		}
		await post.remove();
		req.session.success = 'Post deleted successfully!';
		res.redirect('/');
	},
	async postUserSave(req,res,next){
		res.render('category/test');
	}
}
