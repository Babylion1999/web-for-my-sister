var express = require('express');
var router = express.Router();
const changeName = "articles";
const MainModel 	= require(__path_services + `backend/${changeName}`);
const folderView	 = __path_views_blog + 'pages/category/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', function(req, res, next) {
  MainModel.listItemsSpecial().then((items)=>{
    
    res.render(`${folderView}index`, { 
      layout   : layoutBlog,
      top_post : false,
      top_weeklyNews: false,
      bottom_weeklyNews: false,
      youtubeArea: false,
      recentArticles: false,
      paginationArea: false,
      sildebar:true,
      items
    });
  })
  
});

module.exports = router;
