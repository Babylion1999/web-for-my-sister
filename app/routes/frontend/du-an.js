var express = require('express');
var router = express.Router();
const changeName = "product";
const MainModel 	= require(__path_services + `backend/${changeName}`);
const productModel 	= require(__path_schemas + 'product');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView	 = __path_views_blog + 'pages/du-an/';
const folderViewDetail	 = __path_views_blog + 'pages/du-an-chi-tiet/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let itemsProduct=[]; 
  
  
  await MainModel.listItemsFrontend(null, {task: 'items-in-product'},8).then((items)=>{
    itemsProduct=items;
    
  });
  
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    itemsProduct,
  });
  
});

router.get('/:id', async function(req, res, next) {
  let objWhere	 = {};
  let idProduct 		= ParamsHelpers.getParam(req.params, 'id', '');
  
  
  //test id valid
  
  let itemsProduct = await productModel.findById(idProduct).then((result)=>{
    return result
  }).catch((errors)=>{
    return;
  });
  if(!itemsProduct) {
    res.send('page not fount');
    return;
  }
  // end test

  //produc relate
  let itemsRelate=[]; 
  await MainModel.listItemsFrontend(null, {task: 'items-in-product'},4).then((items)=>{
    itemsRelate=items;
  });

  res.render(`${folderViewDetail}index`, { 
    layout   : layoutBlog,
    itemsProduct,
    idProduct,
    itemsRelate
    
  });
  
});
module.exports = router;
