var express = require('express');
var router = express.Router();
const middleGetMenu  = require(__path_middleware + 'get-menu');
const middleGetSlider  = require(__path_middleware + 'slider');


router.use('/',middleGetMenu,middleGetSlider, require('./home'));
router.use('/auth', require('./auth'));
router.use('/du-an', require('./du-an'));
router.use('/gioi-thieu', require('./gioi-thieu'));
router.use('/tin-tuc', require('./tin-tuc'));
router.use('/chuyen-muc', require('./chuyen-muc'));
router.use('/tin-tuc', require('./articles'));
router.use('/post', require('./post'));
router.use('/lien-he', require('./lien-he'));
router.use('/dich-vu', require('./dich-vu'));


module.exports = router;
