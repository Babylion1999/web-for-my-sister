const CategoriesModel = require(__path_services + `backend/categories`);

module.exports = async(req, res, next) => {
    let itemsCategory=[];
    let itemsSocials=[];
  const listCategory = await CategoriesModel.listItemsFrontend(null, {task: 'items-in-menu'}).then((items)=>{
    itemsCategory=items;
    return itemsCategory
  });
 
  res.locals.itemsCategory = listCategory;
 

  next();
}