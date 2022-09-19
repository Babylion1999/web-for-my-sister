var express = require('express');
var router = express.Router();
const util = require('util');
const UsersModel 	= require(__path_schemas + 'users');
const GroupsModel = require(__path_schemas + 'groups');
const ValidateUsers	= require(__path_validates + 'users');
const folderView	 = __path_views + 'pages/users/';
const notify  		= require(__path_configs + 'notify');
const systemConfig  = require(__path_configs + 'system');
const ParamsHelpers = require(__path_helpers + 'params');
const UtilsHelpers 	= require(__path_helpers + 'utils-users');
const pageTitleIndex = 'Item Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';

const linkIndex		 = '/' + systemConfig.prefixAdmin + '/users/';

// List items

/* GET home page. */
router.get('(/status/:status)?', async function(req, res, next) {
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
		totalItemsPerPage: 5,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

	let groupItems=[];
	await GroupsModel.find({},{_id:1, name:1}).then((item)=>{
		groupItems=item;
		groupItems.unshift({_id:'allvalue',name:'Choose group'})
	});
	console.log(groupID);
	if(groupID !== '') objWhere = {'group.id': groupID};
	if(groupID == 'allvalue') objWhere = {};
	
	
    if(currentStatus !== 'all') objWhere.status = currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');
	
	
	


  await UsersModel.count(objWhere).then( (data) => {
		pagination.totalItems = data;
   
	});
	// mongoose
    UsersModel
		.find(objWhere)
		.sort(sort)
    .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
		.limit(pagination.totalItemsPerPage)
    .then((items)=>{
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
	UsersModel.updateOne({_id: id}, data, (err, result) => {
		req.flash('success', notify.CHANGE_STATUS_SUCCESS, false);
		res.redirect(linkIndex);
	});
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
	UsersModel.updateMany({_id: {$in: req.body.cid }}, data, (err, result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) , false);
		res.redirect(linkIndex);
	});
});
// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	
	
	if(Array.isArray(cids)) {
		cids.forEach((item, index) => {
			console.log('index la:', item);
			let data = { ordering: parseInt(orderings[index]),
				modified:{
					user_id: 0,
					user_name: "0",
					time: Date.now(),
				},
		
			};
			UsersModel.updateOne({_id: item},data, (err, result) => {});
		})
	}else{
		console.log('index la:');
		let data = { ordering: parseInt(orderings),
			modified:{
				user_id: 0,
				user_name: "0",
				time: Date.now(),
			},
	
		}; 
		UsersModel.updateOne({_id: cids}, data, (err, result) => {});
	}

	req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
	res.redirect(linkIndex);
});
// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	UsersModel.deleteOne({_id: id}, (err, result) => {
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});
// Delete - Multi
router.post('/delete', (req, res, next) => {
	UsersModel.remove({_id: {$in: req.body.cid }}, (err, result) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// FORM
router.get(('/form(/:id)?'), async(req, res, next) => {
	
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name: '', ordering: 0, status: 'novalue', price:0};
	let errors   = null;
	let groupItems=[];
	await GroupsModel.find({},{_id:1, name:1}).then((item)=>{
		groupItems=item;
		groupItems.unshift({_id:'novalue',name:'Choose group'})
	});
	
	if(id === '') { // ADD
	
		res.render(`${folderView}form`, {groupItems, pageTitle: pageTitleAdd, item, errors});
		
	}else { // EDIT
	
		UsersModel.findById(id, (err, item) =>{
			item.group_id = item.group.id;
			item.group_name = item.group.name;
			res.render(`${folderView}form`, {groupItems, pageTitle: pageTitleEdit, item, errors});
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', async(req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateUsers.validator(req);

	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	console.log(item);
	if(typeof item !== "undefined" && item.id !== "" ){	// edit
		
		if(errors) { 
			let groupItems=[];
			await GroupsModel.find({},{_id:1, name:1}).then((item)=>{
				groupItems=item;
				groupItems.unshift({_id:'',name:'Choose group'})
			});
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors,groupItems});
		}else {
			UsersModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
				status: item.status,
				price: item.price,
				content: item.content,
				modified:{
					user_id: 0,
					user_name: "0",
					time: Date.now(),
				},
				group:{
					id: item.group_id,
					name: item.group_name,
				}
			}, (err, result) => {
				req.flash('success', notify.EDIT_SUCCESS, false);
				res.redirect(linkIndex);
			});
		}
	}else { // add

		
		if(errors) { 
			let groupItems=[];
			await GroupsModel.find({},{_id:1, name:1}).then((item)=>{
				groupItems=item;
				groupItems.unshift({_id:'',name:'Choose group'})
			});
			res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors,groupItems});
		}else {
			item.created = {
				user_id: 0,
				user_name: "abc",
				time: Date.now(),
			},
			item.group ={
				id: item.group_id,
				name: item.group_name,
			},
		
			new UsersModel(item).save().then(()=> {
				req.flash('success', notify.ADD_SUCCESS, false);
				res.redirect(linkIndex);
			})
		}
	}	
});

//SORT
router.get(('/sort/:sort_field/:sort_type'), async(req, res, next) => {
	
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'esc');
	
	res.redirect(linkIndex);
});
module.exports = router;
//group
router.get(('/filter-group/:group_id'), async(req, res, next) => {
	
	req.session.group_id		= ParamsHelpers.getParam(req.params, 'group_id', '');
	
	
	res.redirect(linkIndex);
});
module.exports = router;
