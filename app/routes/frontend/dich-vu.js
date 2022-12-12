var express = require('express');
var router = express.Router();
const changeName = "service";
const MainModel 	= require(__path_services + `backend/${changeName}`);
const serviceModel 	= require(__path_schemas + 'service');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView	 = __path_views_blog + 'pages/dich-vu/';
const folderViewDetail	 = __path_views_blog + 'pages/dich-vu-chi-tiet/';
const layoutBlog	 = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let itemsService=[]; 
  await MainModel.listItemsFrontend(null, {task: 'items-in-service'},8).then((items)=>{
    itemsService=items;
    
  });
  res.render(`${folderView}index`, { 
    layout   : layoutBlog,
    itemsService
  });
  
});
router.get('/:id', async function(req, res, next) {
  let objWhere	 = {};
  let idService 		= ParamsHelpers.getParam(req.params, 'id', '');
  
  
  //test id valid
  
  let serviceDetail = await serviceModel.findById(idService).then((result)=>{
    return result
  }).catch((errors)=>{
    return;
  });
  if(!serviceDetail) {
    res.send('page not fount');
    return;
  }
  // end test
  
  //produc relate
  let itemsRelate=[]; 
  await MainModel.listItemsFrontend(null, {task: 'items-in-service'},4).then((items)=>{
    itemsRelate=items;
  });

  res.render(`${folderViewDetail}index`, { 
    layout   : layoutBlog,
    serviceDetail,
    idService,
    itemsRelate
    
  });
  
});
module.exports = router;
