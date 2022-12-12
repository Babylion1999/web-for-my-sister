var express = require('express');
var router = express.Router();

const folderView	 = __path_views_admin + 'pages/dashboard/';
const ItemsModel 	= require(__path_schemas + 'items');
const SliderModel 	= require(__path_schemas + 'slider');
const UsersModel	= require(__path_schemas + 'users');
const ArticlesModel	= require(__path_schemas + 'articles');
const CategoriesModel	= require(__path_schemas + 'categories');
const GroupsModel	= require(__path_schemas + 'groups');
const ProductModel	= require(__path_schemas + 'product');
const ServiceModel	= require(__path_schemas + 'service');




/* GET dashboard page. */
router.get('/', async(req, res, next) => {

	let countItems = 0;
	let countSlider = 0;
	let countUsers = 0;
	let countArticles =0;
	let countCategories =0;
	let countGroups =0;
	let countService =0;
	
	await ItemsModel.count({}).then( (data) => {
		countItems = data;
	});
	await SliderModel.count({}).then( (data) => {
		countSlider = data;
	});
	
	await UsersModel.count({}).then( (data) => {
		countUsers = data;
	});
	await ArticlesModel.count({}).then( (data) => {
		countArticles = data;
	});
	await CategoriesModel.count({}).then( (data) => {
		countCategories = data;
	});
	await GroupsModel.count({}).then( (data) => {
		countGroups = data;
	});
	await ProductModel.count({}).then( (data) => {
		countProduct = data;
	});
	await ServiceModel.count({}).then( (data) => {
		countService = data;
	});
	

	res.render(`${folderView}index`, { 
		pageTitle: 'Dashboard Page', 
		countItems:countItems,
		countSlider:countSlider,
		countUsers: countUsers,
		countArticles: countArticles,
		countCategories:countCategories,
		countGroups: countGroups,
		countProduct: countProduct,
		countService: countService,
	});
});

module.exports = router;
