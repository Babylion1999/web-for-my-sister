var express = require('express');
var router = express.Router();

const folderView	 = __path_views_blog + 'pages/post/';
const layoutBlog	 = __path_views_blog + 'frontend_post';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    top_post : false,
    top_weeklyNews: false,
    bottom_weeklyNews: false,
    youtubeArea: false,
    recentArticles: false,
    paginationArea: false,
    sildebar:false,
    sildebarFilter: true,
  });
});

module.exports = router;
