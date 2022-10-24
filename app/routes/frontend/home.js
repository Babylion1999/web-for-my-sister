var express = require('express');
var router = express.Router();
const changeName = "articles";
const CategoriesModel = require(__path_services + `backend/categories`);
const MainModel 	= require(__path_services + `backend/${changeName}`);

const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let itemsTopPost =[];
  let itemsCategory=[];
  
  await MainModel.listItemsFrontend(null, {task: 'list-artical'}).then((items)=>{
    itemsTopPost=items;
    
  });
  await CategoriesModel.listItemsFrontend(null, {task: 'items-in-menu'}).then((items)=>{
    itemsCategory=items;
    
  });
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    
    
    
    servicesSlider: true,
    sildebar:true,
    itemsTopPost,
    itemsCategory,
   });


  
});

module.exports = router;
