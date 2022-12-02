const SliderModel = require(__path_services + `backend/slider`);

module.exports = async(req, res, next) => {
    let itemsSlider=[];
    
  const listSlider = await SliderModel.listItemsFrontend(null, {task: 'items-in-slider'},3).then((items)=>{
    itemsSlider=items;
    return itemsSlider
  });

  res.locals.itemsSlider = listSlider;
 

  next();
}