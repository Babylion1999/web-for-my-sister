var express = require('express');
var router = express.Router();
const util = require('util');
const changeName = "items";
const ItemsModel 	= require(__path_services + `backend/${changeName}`);
const CategoriesModel = require(__path_services + `backend/categories`);
const ValidateItems	= require(__path_validates + `${changeName}`);
const folderView	 = __path_views + `pages/${changeName}/`;
const notify  		= require(__path_configs + 'notify');
const systemConfig  = require(__path_configs + 'system');
const ParamsHelpers = require(__path_helpers + 'params');
const UtilsHelpers 	= require(__path_helpers + `utils-${changeName}`);
const pageTitleIndex = 'Item Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';

const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${changeName}/`;

// List items

/* GET home page. */
router.get('(/status/:status)?', async function(req, res, next) {
  let objWhere	 = {};
  
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus= ParamsHelpers.getParam(req.params, 'status', 'all'); 
  let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);
  let sortField = ParamsHelpers.getParam(req.session, 'sort_field', 'ordering');
  let sortType = ParamsHelpers.getParam(req.session, 'sort_type', 'asc');
  let categoryID = ParamsHelpers.getParam(req.session, 'category_id', '');
	let sort = {};
	sort[sortField] = sortType;
  let title= req.query.title;
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 3,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

	let categoryItems=[];
	await CategoriesModel.listItemsSelectBox().then((item)=>{
		categoryItems=item;
	 	categoryItems.unshift({_id:'allvalue',name:'Choose category'})
	});
	
	
	if(categoryID !== '') objWhere = {'category.id': categoryID};
	if(categoryID == 'allvalue') objWhere = {};	
    if(currentStatus !== 'all') objWhere.status = currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');
	
	ItemsModel.listItems(objWhere,pagination,categoryItems,sort,categoryID).then((items)=>{
		console.log(categoryID);
		res.render(`${folderView}list`, { pageTitle   : 'itemsPage ',
      massage: title,
      items,
      keyword,
      currentStatus,
      statusFilter,
      pagination,
	  categoryItems,
	  sortField,
	  sortType,
	  categoryID,
    });
	});
});
// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	let status			= (currentStatus === "active") ? "inactive" : "active";
	let data = { status:status,
		modified:{
			user_id: 0,
			user_name: "0",
			time: Date.now(),
		},

	};
	ItemsModel.changeStatus(id,data).then((result)=>{
		req.flash('success', notify.CHANGE_STATUS_SUCCESS, false);
		res.redirect(linkIndex);
	})
	});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	let data = { status:currentStatus,
		modified:{
			user_id: 0,
			user_name: "0",
			time: Date.now(),
		},

	};
	
	ItemsModel.changeStatusMulti({$in: req.body.cid },data).then((result)=>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) , false);
		res.redirect(linkIndex);
	});
});
// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	
	
	ItemsModel.changeOrdering(orderings,cids,null).then((result)=>{
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
		res.redirect(linkIndex);
	});
});
// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	
	ItemsModel.delete(id).then((result)=>{
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});
// Delete - Multi
router.post('/delete', (req, res, next) => {
	ItemsModel.deleteMulti({$in: req.body.cid }).then((result)=>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// FORM
router.get(('/form(/:id)?'), async(req, res, next) => {
	
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name: '', ordering: 0, status: 'novalue', price:0};
	let errors   = null;
	let categoryItems=[];
	await CategoriesModel.listItemsSelectBox().then((item)=>{
		categoryItems=item;
		categoryItems.unshift({_id:'novalue',name:'Choose category'})
	});
	
	
	if(id === '') { // ADD
		console.log(item);
		res.render(`${folderView}form`, {categoryItems, pageTitle: pageTitleAdd, item, errors});
		
	}else { // EDIT
		ItemsModel.form(id).then((item)=>{
			item.category_id = item.category.id;
			item.category_name = item.category.name;
			console.log(item);
			res.render(`${folderView}form`, {categoryItems, pageTitle: pageTitleEdit, item, errors});
		});
		
	}
});

// SAVE = ADD EDIT
router.post('/save', async(req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateItems.validator(req);

	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? "edit" : "add";
		if(errors) { 
			let categoryItems=[];
			let pageTitle=(taskCurrent=="edit") ? pageTitleEdit : pageTitleAdd;
			await CategoriesModel.listItemsSelectBox().then((item)=>{
				categoryItems=item;
				categoryItems.unshift({_id:'',name:'Choose category'});
			});
			
			res.render(`${folderView}form`, { pageTitle, item, errors,categoryItems});
		}else{
			let massage= (taskCurrent=="edit") ? notify.EDIT_SUCCESS : notify.ADD_SUCCESS;
			ItemsModel.saveItems(item,{task:taskCurrent}).then((result)=>{
				req.flash('success', massage, false);
				res.redirect(linkIndex);
			});
		}
			
});

//SORT
router.get(('/sort/:sort_field/:sort_type'), async(req, res, next) => {
	
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'esc');
	
	res.redirect(linkIndex);
});
module.exports = router;
//category
router.get(('/filter-category/:category_id'), async(req, res, next) => {
	
	req.session.category_id		= ParamsHelpers.getParam(req.params, 'category_id', '');
	
	// console.log(req.session);
	res.redirect(linkIndex);
});
module.exports = router;
