var express = require('express');
var router = express.Router();



const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig  = require(__path_configs + 'system');



const folderView	= __path_views_blog + 'pages/auth/';
const layoutLogin   = __path_views_blog + 'login';
const layoutBlog   	= __path_views_blog + 'frontend';

const ValidateLogin	= require(__path_validates + 'login');


/* GET login page. */
router.get('/login', function(req, res, next) {
	
	console.log(1);
	let item	= {email: '', 'password': ''};
	let errors   = null;
	res.render(`${folderView}login`, { layout: layoutLogin, errors, item });
});



module.exports = router;
