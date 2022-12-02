var express = require('express');
var router = express.Router();
const changeName = "articles";
const CategoriesModel = require(__path_services + `backend/categories`);
const ArticalsModel 	= require(__path_services + `backend/articles`);
const ProductModel 	= require(__path_services + `backend/product`);


const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let itemsTopPost =[];
  let itemsProduct=[]; 
  let itemsArticle=[]; 
 

  await ProductModel.listItemsFrontend(null, {task: 'items-in-product'},4).then((items)=>{
    itemsProduct=items;
    
  });
  await ArticalsModel.listItemsFrontend(null, {task: 'items-all-articles'},4).then((items)=>{
    itemsArticle=items;
    
  });
 

  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    itemsProduct,
    itemsArticle
   
   });


  
});

module.exports = router;
