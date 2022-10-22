var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/category', require('./category'));
router.use('/post', require('./post'));
router.use('/about', require('./about'));


module.exports = router;
