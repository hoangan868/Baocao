const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewKV3Schema = new Schema({
    name: String,
    status: String,
    slug:String,
    images: [ { url: String, public_id: String } ],
    fathername:String,
    grandfathername:String,
    desc:String,
    url: String,
    school:Number,
    priceSellMin:Number,
    priceSellMax:Number,
    priceRentMin:Number,
    priceRentMax:Number,
    mart:Number,
    hopital:Number,
    superMall:Number,
    superMarket:Number,
    school_1:Number,
    school_2:Number,
    bank_ATM:Number,
    image_map:[{url:String, public_id:String}]
});

module.exports = mongoose.model('reviewKV3', ReviewKV3Schema);