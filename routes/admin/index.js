const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../cloudinary');
const upload = multer({ storage });
const { 
  adminPage,
  getLoginAdmin,
  postLoginAdmin,
  getLogoutAdmin,
  getCate,
  newCategory,
  PostNewCate,
  cateShow,
  cateEdit,
  cateUpdate,
  cateDestroy,
  getUser,
  getKhuVuc,
  newKhuVuc,
  PostNewKhuVuc,
  getKhuVuc2,
  PostNewKhuVuc2,
  newKhuVuc2,
  KV2Edit,
  KV2Update,
  KV2Show,
  getKhuVuc3,
  newKhuVuc3,
  PostNewKhuVuc3,
  getRoom,
  roomEdit,
  phongUpdate
 } = require('../../controllers/admin');
const { 
  asyncErrorHandler,
  isLoggedInAdmin
 } = require('../../middleware');
/* GET home/landing page. */

/* GET /register. */
router.get('/landing', isLoggedInAdmin, asyncErrorHandler(adminPage));
/* POST /login. */
router.get('/', getLoginAdmin);
router.post('/', asyncErrorHandler(postLoginAdmin));
router.get('/logoutAdmin', getLogoutAdmin);
router.get('/category',isLoggedInAdmin,asyncErrorHandler(getCate));
router.get('/category/new',isLoggedInAdmin,asyncErrorHandler(newCategory));
router.post('/category/new', asyncErrorHandler(PostNewCate));
router.get('/category/:id', asyncErrorHandler(cateShow));
router.get('/category/:id/edit', isLoggedInAdmin, cateEdit);
router.put('/category/:id', isLoggedInAdmin, asyncErrorHandler(cateUpdate));
router.delete('/category/:id', isLoggedInAdmin, asyncErrorHandler(cateDestroy));
router.get('/user',isLoggedInAdmin,asyncErrorHandler(getUser));

router.get('/khuvuc/kv1',isLoggedInAdmin,asyncErrorHandler(getKhuVuc));
router.get('/khuvuc/new',isLoggedInAdmin,asyncErrorHandler(newKhuVuc));
router.post('/khuvuc/new',upload.array('images', 1),asyncErrorHandler(PostNewKhuVuc));


router.get('/khuvuc/kv2',isLoggedInAdmin,asyncErrorHandler(getKhuVuc2));
router.get('/khuvuc/new2',isLoggedInAdmin,asyncErrorHandler(newKhuVuc2));
router.post('/khuvuc/new2',upload.array('images', 1),asyncErrorHandler(PostNewKhuVuc2));
router.get('/khuvuc/:id', asyncErrorHandler(KV2Show));
router.get('/khuvuc/:id/edit',  KV2Edit);
router.put('/khuvuc/:id',  asyncErrorHandler(KV2Update));

router.get('/khuvu/kvend',getKhuVuc3);
router.get('/khuvu/new3', newKhuVuc3);
router.post('/khuvu/new3',upload.array('images', 5),asyncErrorHandler(PostNewKhuVuc3));

router.get('/room', isLoggedInAdmin, asyncErrorHandler(getRoom));
router.get('/room/:id/edit', isLoggedInAdmin, asyncErrorHandler(roomEdit));
router.put('/room/:id', asyncErrorHandler(phongUpdate));
module.exports = router;
