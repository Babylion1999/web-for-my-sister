var express = require('express');
var router = express.Router();
const changeName = "articles";
const MainModel 	= require(__path_services + `backend/${changeName}`);
const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let itemsTopPost =[];
  await MainModel.listItemsFrontend().then((items)=>{
    itemsTopPost=items
  });

  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    top_post : true,
    top_weeklyNews: true,
    bottom_weeklyNews: true,
    youtubeArea: true,
    recentArticles: true,
    paginationArea: true,
    sildebar:true,
    itemsTopPost
   });
});

module.exports = router;
