const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	getCateNew,
	search,test
} = require('../controllers/cate');
const {
	asyncErrorHandler,
	searchPostCateFilter
} = require('../middleware');
router.get('/search', search);
router.get('/:id', asyncErrorHandler(searchPostCateFilter) ,asyncErrorHandler(getCateNew));
router.get('/category/test',test);
module.exports = router;