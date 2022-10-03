var express = require('express');
var router = express.Router();

const folderView	 = __path_views_admin + 'pages/dashboard/';
const ItemsModel 	= require(__path_schemas + 'items');
const SliderModel 	= require(__path_schemas + 'slider');

/* GET dashboard page. */
router.get('/', async(req, res, next) => {

	let countItems = 0;
	let countSlider = 0;
	await ItemsModel.count({}).then( (data) => {
		countItems = data;
	});
	await SliderModel.count({}).then( (data) => {
		countSlider = data;
	});

	res.render(`${folderView}index`, { 
		pageTitle: 'Dashboard Page', 
		countItems:countItems,
		countSlider:countSlider,
	});
});

module.exports = router;
