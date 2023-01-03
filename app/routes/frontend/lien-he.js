var express = require('express');
var router = express.Router();
const changeName = "articles";
const MainModel 	= require(__path_services + `backend/${changeName}`);
const CategoriesModel = require(__path_services + `backend/categories`);
const notify  		= require(__path_configs + 'notify');
const folderView	 = __path_views_blog + 'pages/lien-he/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {

  
 
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
  
    
  });
});
router.post('/123',async function(req, res, next) {
 
  
});
module.exports = router;
