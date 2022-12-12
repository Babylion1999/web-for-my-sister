var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/slider', require('./slider'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/articles', require('./articles'));
router.use('/categories', require('./categories'));
router.use('/product', require('./product'));
router.use('/service', require('./service'));
router.use('/settings', require('./settings'));


module.exports = router;
