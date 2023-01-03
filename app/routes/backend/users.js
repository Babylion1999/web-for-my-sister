var express = require('express');
var router = express.Router();
const fs = require('fs');
const util = require('util');



const UsersModel 	= require(__path_services + `backend/users`);
const GroupsModel = require(__path_services + `backend/groups`);
const ValidateUsers	= require(__path_validates + 'users');
const folderView	 = __path_views_admin + 'pages/users/';
const notify  		= require(__path_configs + 'notify');
const systemConfig  = require(__path_configs + 'system');
const ParamsHelpers = require(__path_helpers + 'params');
const fileHelpers = require(__path_helpers + 'upload');
const UtilsHelpers 	= require(__path_helpers + 'utils-users');
const pageTitleIndex = 'Item Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const uploadAvatar = fileHelpers.uploadImg('avatar','adminlte/images')

const linkIndex		 = '/' + systemConfig.prefixAdmin + '/users/';


// // upload img
// router.get('/upload', function(req, res, next){
// 	let errors=null;
// 	res.render(`${folderView}upload`, { pageTitle   : 'get upload img',errors})
// });
// router.post('/upload', function(req, res, next){
// 	uploadAvatar(req, res, function(errUpload) {
// 		let errors =[];
// 		 if (errUpload) {
// 		  // Một lỗi không xác định xảy ra khi upload.
// 		  errors.push({param: 'hello',msg:errUpload})
// 		}
// 		res.render(`${folderView}upload`, { pageTitle   : 'save upload img',errors})
// 		// Mọi thứ khác chạy ok.
// 	  });
	
// });

// List items
/* GET home page. */
router.get('(/status/:status)?',  async function(req, res, next) {
  let objWhere	 = {};
  
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus= ParamsHelpers.getParam(req.params, 'status', 'all'); 
  let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);
  let sortField = ParamsHelpers.getParam(req.session, 'sort_field', 'ordering');
  let sortType = ParamsHelpers.getParam(req.session, 'sort_type', 'asc');
  let groupID = ParamsHelpers.getParam(req.session, 'group_id', '');
	let sort = {};
	sort[sortField] = sortType;
  let title= req.query.title;
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 3,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

	let groupItems=[];
	await GroupsModel.listItemsSelectBox().then((item)=>{
		groupItems=item;
	 	groupItems.unshift({_id:'allvalue',name:'Choose group'})
	});
	console.log(groupID);
	if(groupID !== '') objWhere = {'group.id': groupID};
	if(groupID == 'allvalue') objWhere = {};	
    if(currentStatus !== 'all') objWhere.status = currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');
	
	UsersModel.listItems(objWhere,pagination,groupItems,sort,groupID).then((items)=>{
		console.log(groupID);
		res.render(`${folderView}list`, { pageTitle   : 'usersPage ',
      massage: title,
      items,
      keyword,
      currentStatus,
      statusFilter,
      pagination,
	  groupItems,
	  sortField,
	  sortType,
	  groupID,
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
	UsersModel.changeStatus(id,data).then((result)=>{
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
	
	UsersModel.changeStatusMulti({$in: req.body.cid },data).then((result)=>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) , false);
		res.redirect(linkIndex);
	});
});
// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	
	
	UsersModel.changeOrdering(orderings,cids,null).then((result)=>{
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
		res.redirect(linkIndex);
	});
});
// Delete
router.get('/delete/:id', async(req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	UsersModel.delete(id).then((result)=>{
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});
// Delete - Multi
router.post('/delete', (req, res, next) => {
	UsersModel.deleteMulti({$in: req.body.cid }).then((result)=>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// FORM
router.get(('/form(/:id)?'), async(req, res, next) => {
	
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name: '', ordering: 0, status: 'novalue', price:0, username: '', password:''};
	let errors   = null;
	let groupItems=[];
	await GroupsModel.listItemsSelectBox().then((item)=>{
		groupItems=item;
		groupItems.unshift({_id:'novalue',name:'Choose group'})
	});
	console.log('id',id);
	
	if(id === '') { // ADD
	
		res.render(`${folderView}form`, {groupItems, pageTitle: pageTitleAdd, item, errors});
		
	}else { // EDIT
		UsersModel.form(id).then((item)=>{
			item.group_id = item.group.id;
			item.group_name = item.group.name;
			res.render(`${folderView}form`, {groupItems, pageTitle: pageTitleEdit, item, errors});
		});
		
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	uploadAvatar(req, res, async function(errUpload) {
	req.body = JSON.parse(JSON.stringify(req.body));
	
	let item = Object.assign(req.body);
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? "edit" : "add";
	// let errors = ValidateUsers.validator(req,errUpload,taskCurrent);
		ValidateUsers.validator(req);
		let errors = req.validationErrors() !== false ? req.validationErrors() : [];
		if (errUpload) {
			// errors.push({param: 'avatar',msg:errUpload});
			if(errUpload=='123'){errors.push({param: 'thumb',msg:'file k hop le'})}
         if(errUpload.code=='LIMIT_FILE_SIZE'){errors.push({param: 'thumb',msg:notify.ERROR_FILE_LARGE})}
			
		}else if(req.file==undefined && taskCurrent=="add"){
			errors.push({param: 'avatar',msg:notify.ERROR_FILE_REQUIRE})
		}
	
	
		if(errors.length > 0) { 
			console.log(req.file);
			if(req.file!=undefined){
				let path='public/adminlte/images/users/'+ req.file.filename;
				fileHelpers.removeImg(path);	
			};
			let groupItems=[];
			let pageTitle=(taskCurrent=="edit") ? pageTitleEdit : pageTitleAdd;
			await GroupsModel.listItemsSelectBox().then((item)=>{
				groupItems=item;
				groupItems.unshift({_id:'',name:'Choose group'});
				
			});
			
			res.render(`${folderView}form`, { pageTitle, item, errors,groupItems});
		
		}else{
			let massage= (taskCurrent=="edit") ? notify.EDIT_SUCCESS : notify.ADD_SUCCESS;
			
			
			 if(req.file!=undefined){
				item.avatar= req.file.filename;
				if(taskCurrent==="edit") 
				{
					let path= 'public/adminlte/images/users/'+ item.image_old;
				fileHelpers.removeImg(path);	
				}
			}else{item.avatar=undefined;
				if(taskCurrent==="edit"){item.avatar=item.image_old;}
			};
			
			UsersModel.saveItems(item,{task:taskCurrent}).then((result)=>{
				req.flash('success', massage, false);
				res.redirect(linkIndex);
			});
		}
	});		
});

//SORT
router.get(('/sort/:sort_field/:sort_type'), async(req, res, next) => {
	
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'desc');
	
	res.redirect(linkIndex);
});
module.exports = router;
//group
router.get(('/filter-group/:group_id'), async(req, res, next) => {
	
	req.session.group_id		= ParamsHelpers.getParam(req.params, 'group_id', '');
	
	
	res.redirect(linkIndex);
});
module.exports = router;
