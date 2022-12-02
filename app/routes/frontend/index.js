var express = require('express');
var router = express.Router();
const middleGetMenu  = require(__path_middleware + 'get-menu');
const middleGetSlider  = require(__path_middleware + 'slider');

router.use('/',middleGetMenu,middleGetSlider, require('./home'));
router.use('/du-an', require('./du-an'));
router.use('/gioi-thieu', require('./gioi-thieu'));
router.use('/tin-tuc', require('./tin-tuc'));
router.use('/category', require('./category'));
router.use('/articles', require('./articles'));
router.use('/post', require('./post'));
router.use('/lien-he', require('./lien-he'));


module.exports = router;
