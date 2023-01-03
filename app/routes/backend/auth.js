var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var alert = require('alert');


const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig  = require(__path_configs + 'system');
const UsersModel 	= require(__path_services + `backend/users`);


const folderView	= __path_views_blog + 'pages/auth/';
const layoutLogin   = __path_views_blog + 'login';
const layoutBlog   	= __path_views_blog + 'frontend';

const linkIndex		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/dashboard'); 
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/auth/login/'); 

const ValidateLogin	= require(__path_validates + 'login');

router.get('/logout', function(req, res, next) {
	console.log('121232');
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect(linkLogin);
	  });
	
});
/* GET login page. */
router.get('/login', function(req, res, next) {
	
	if(req.isAuthenticated())res.redirect(linkLogin);
	let item	= {email: '', 'password': ''};
	let errors   = null;
	res.render(`${folderView}login`, { layout: layoutLogin, errors, item });
});
router.post('/login', function(req, res, next) {
	
	console.log('post');
	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateLogin.validator(req);

	let item 	= Object.assign(req.body);
	let errors 	= req.validationErrors();
	if(errors) { 
		res.render(`${folderView}login`, {  layout: layoutLogin, item, errors });
	}else {
		console.log('OK');
		
		passport.authenticate('local', {
			successRedirect: linkIndex,
			failureRedirect: linkLogin,
			
		  })(req, res, next);
	}
	
	
});
passport.use(new LocalStrategy(
 (username, password, done) => {
   console.log(username + "----" + password);
   UsersModel.getItemByUsername(username,null).then((users)=>{
	
	let user = users[0];
	if(user == undefined || user.length == 0 ){
		console.log('khong ton tai user')
		
		return done(null,false)
	}else{
		if(password !== user.password){
			console.log('mat khau khong dung');
			return done(null,false)
		}else{
			console.log('mat khau ok');
			return done(null,user)
		}
	}
   })
  
  }
));
passport.serializeUser(function(user,done){
	done(null,user._id);
});
passport.deserializeUser(function(id,done){
	UsersModel.getItem(id,null).then((user)=>{
		done(null,user);
	})
});



module.exports = router;
