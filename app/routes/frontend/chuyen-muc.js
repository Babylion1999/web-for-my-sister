var express = require('express');
var router = express.Router();
const ArticlesModel 	= require(__path_services + `backend/articles`);
const CategoriesModel = require(__path_services + `backend/categories`);
const categoriesModel 	= require(__path_schemas + 'categories');

const ParamsHelpers = require(__path_helpers + 'params');
const folderView	 = __path_views_blog + 'pages/category/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('(/:slug)?', async function(req, res, next) {
  let objWhere	 = {};
  
  // let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
  let slugCategory 		= ParamsHelpers.getParam(req.params, 'slug', '');
  
  
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
  let itemsAll=[];
  let itemsNews=[];
	let itemsInCategory	= [];
  
 let Categories= await categoriesModel.find({slug: slugCategory }).then((result)=>{
    return result
  });
  
  let idCategory= Categories[0].id;
  
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 4,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

  if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');
  
  if(idCategory != 'tong-hop'){
      // check id category truong khi findByID
      let checkId = await categoriesModel.findById(idCategory).then((result)=>{
        return result
      }).catch((errors)=>{
        return;
      });
      if(!checkId) {
        res.send('page not fount');
        return;
      }
      // kết thúc checkfile
    }else{
      await ArticlesModel.listItemsFrontend(null, {task: 'items-all-articles'}).then((items)=>{
        itemsAll=items; 
      });
    }
  await ArticlesModel.listItemsFrontend(null, {task: 'items-news'}).then((items)=>{
    itemsNews=items;
  });
  
  // Article In Category
	await ArticlesModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'},'',pagination, objWhere ).then( (items) => { itemsInCategory = items; });
 
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    sildebarFilter: true,
    itemsNews,
    itemsAll,
    itemsInCategory,
    keyword,
    pagination,
    slugCategory,
  });
});



module.exports = router;
