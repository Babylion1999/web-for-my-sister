const CategoriesModel = require(__path_services + `backend/categories`);
const ServiceModel = require(__path_services + `backend/service`);
module.exports = async(req, res, next) => {
    let itemsCategory=[];
    let itemsSocials=[];
    let itemsService=[]; 
  const listCategory = await CategoriesModel.listItemsFrontend(null, {task: 'items-in-menu'}).then((items)=>{
    itemsCategory=items;
    return itemsCategory
  });
  
  await ServiceModel.listItemsFrontend(null, {task: 'items-in-service'}).then((items)=>{
    itemsService=items;
    
  });
  
  res.locals.itemsCategory = listCategory;
  res.locals.itemsService = itemsService;
 

  next();
}