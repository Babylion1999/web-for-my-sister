var express = require('express');
var router = express.Router();
const articlesModel 		= require(__path_schemas + 'articles');
const folderView	 = __path_views_blog + 'pages/articles/';
const layoutBlog	 = __path_views_blog + 'frontend';
const ArticlesModel 	= require(__path_services + `backend/articles`);
const CategoriesModel = require(__path_services + `backend/categories`);

const ParamsHelpers = require(__path_helpers + 'params');




/* GET home page. */
router.get('/:slug', async function(req, res, next) {
  let itemsNews=[];
  // let idArticle 		= ParamsHelpers.getParam(req.params, 'id', null);
  let slugArticle 		= ParamsHelpers.getParam(req.params, 'slug', null);

  // let itemArticle = await articlesModel.findById(idArticle).then((result)=>{
  //   return result
  // }).catch((errors)=>{
  //   return;
  // });
  // if(!itemArticle) {
  //   res.send('page not fount');
  //   return;
  // }
 let itemArticle = await articlesModel.findOne({slug:slugArticle}).then((result)=>{
  return result
 })
 

  await ArticlesModel.listItemsFrontend(null, {task: 'items-news'}).then((items)=>{
    itemsNews=items;
  });
 
  await CategoriesModel.listItemsFrontend(null, {task: 'items-in-menu'}).then((items)=>{
    itemsCategory=items;
    
  });
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    itemArticle,
    itemsNews, 
  });
});

module.exports = router;
