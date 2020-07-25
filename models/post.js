const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const Category = require('./category');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
	title: String,
	price: String,
	cate: String,
	utils: [String],
	description: String,
	adress: String,
	city:String,
	provice:String,
	state:String,
	local:String,
	sex:String,
	dt:String,
	people:Number,
	waterPrice:Number,
	electricPrice:Number,
	wc:String,
	homenum:String,
	images: [ { url: String, public_id: String } ],
	location: String,
	url: String,
	status: String,
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	properties: {
		description: String
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	avgRating: { type: Number},
	createdAt: Date,
	view: {type: Number, default: 0},

});

PostSchema.pre('remove', async function() {
	await Review.remove({
		_id: {
			$in: this.reviews
		}
	});
});

PostSchema.methods.calculateAvgRating = function() {
	let ratingsTotal = 0;
	if(this.reviews.length) {
		this.reviews.forEach(review => {
			ratingsTotal += review.rating;
		});
		this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
	} else {
		this.avgRating = ratingsTotal;
	}
	const floorRating = Math.floor(this.avgRating);
	this.save();
	return floorRating;
}

PostSchema.plugin(mongoosePaginate);

PostSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);








