const express = require('express');
const router = express.Router();
const {
    getListAdress,
	getListAdressSecond,
	getListAdressThird,
	getListPost
} = require('../controllers/reviewKV');
const {
	asyncErrorHandler,
	isLoggedIn,
	isValidPassword,
	changePassword
} = require('../middleware');
const { route } = require('./admin');


router.get('/',getListAdress);
router.get('/:slug',getListAdressSecond);
router.get('/:fathername/:slug',getListAdressThird);
router.get('/:fathername/:slug/cho-thue',getListPost);
module.exports = router;
