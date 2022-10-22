var express = require('express');
var router = express.Router();
const changeName = "articles";
const MainModel 	= require(__path_services + `backend/${changeName}`);
const CategoriesModel = require(__path_services + `backend/categories`);
const folderView	 = __path_views_blog + 'pages/category/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {

  let itemsCategory=[];
  let itemsAll=[];
  await CategoriesModel.listItemsFrontend(null, {task: 'items-in-menu'}).then((items)=>{
    itemsCategory=items;
    
  });
  await MainModel.listItemsFrontend(null, {task: 'items-all-articles'}).then((items)=>{
    itemsAll=items;
    
  });
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    top_post : false,
    top_weeklyNews: false,
    bottom_weeklyNews: false,
    youtubeArea: false,
    recentArticles: false,
    paginationArea: false,
    sildebar:true,
    itemsCategory,
    itemsAll,
  });
});

module.exports = router;