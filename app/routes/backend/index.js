var express = require('express');
var router = express.Router();
const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig  = require(__path_configs + 'system');
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/auth/login/'); 
router.use('/auth', require('./auth'));


router.use('/',(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect(linkLogin)
    }
} , require('./home'));

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
router.use('/menubar', require('./menubar'));
router.use('/contact', require('./contact'));

module.exports = router;
