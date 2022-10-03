var express = require('express');
var router = express.Router();
const util = require('util');
const SliderModel 	= require(__path_schemas + 'slider');
const ValidateSlider	= require(__path_validates + 'slider');
const folderView	 = __path_views_admin + 'pages/slider/';
const notify  		= require(__path_configs + 'notify');
const systemConfig  = require(__path_configs + 'system');
const ParamsHelpers = require(__path_helpers + 'params');
const UtilsHelpers 	= require(__path_helpers + 'utils-slider');
const pageTitleIndex = 'Item Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';

const linkIndex		 = '/' + systemConfig.prefixAdmin + '/slider/';

// List items

/* GET home page. */
router.get('(/status/:status)?', async function(req, res, next) {
  let objWhere	 = {};
  
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus= ParamsHelpers.getParam(req.params, 'status', 'all'); 
  let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);
  let title= req.query.title;
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 5,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

  console.log(req.path);

    if(currentStatus !== 'all') objWhere.status = currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');



  await SliderModel.count(objWhere).then( (data) => {
		pagination.totalItems = data;
    console.log("data", data);
	});
	// mongoose
    SliderModel
		.find(objWhere)
		
    .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
		.limit(pagination.totalItemsPerPage)
    .then((items)=>{
      res.render(`${folderView}list`, { pageTitle   : 'SliderPage ',
      massage: title,
      items,
      keyword,
      currentStatus,
      statusFilter,
      pagination,
    });
      console.log(title);
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
	SliderModel.updateOne({_id: id}, data, (err, result) => {
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
	SliderModel.updateMany({_id: {$in: req.body.cid }}, data, (err, result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) , false);
		res.redirect(linkIndex);
	});
});
// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	console.log(cids);
 	if(Array.isArray(cids)) {
		cids.forEach((item, index) => {
			let data = { ordering: parseInt(orderings[index]),
				modified:{
					user_id: 0,
					user_name: "0",
					time: Date.now(),
				},
		
			};
			SliderModel.updateOne({_id: item},data, (err, result) => {});
		})
	}else{
		let data = { ordering: parseInt(orderings),
			modified:{
				user_id: 0,
				user_name: "0",
				time: Date.now(),
			},
	
		}; 
		SliderModel.updateOne({_id: cids}, data, (err, result) => {});
	}

	req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
res.redirect(linkIndex);
});
// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	SliderModel.deleteOne({_id: id}, (err, result) => {
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});
// Delete - Multi
router.post('/delete', (req, res, next) => {
	SliderModel.remove({_id: {$in: req.body.cid }}, (err, result) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// FORM
router.get(('/form(/:id)?'), (req, res, next) => {
	
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let item	= {name: '', ordering: 0, status: 'novalue', price:0};
	let errors   = null;
	console.log(id+"sdjshdb");
	if(id === '') { // ADD
		console.log(1);
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors});
		
	}else { // EDIT
		console.log(2);
		SliderModel.findById(id, (err, item) =>{
			console.log(2);
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors});
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateSlider.validator(req);

	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	console.log(item);
	if(typeof item !== "undefined" && item.id !== "" ){	// edit
		console.log("update");
		if(errors) { 
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors});
		}else {
			SliderModel.updateOne({_id: item.id}, {
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
			}, (err, result) => {
				req.flash('success', notify.EDIT_SUCCESS, false);
				res.redirect(linkIndex);
			});
		}
	}else { // add

		console.log("add");
		if(errors) { 
			res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors});
		}else {
			item.created = {
				user_id: 0,
				user_name: "abc",
				time: Date.now(),
			},
			new SliderModel(item).save().then(()=> {
				req.flash('success', notify.ADD_SUCCESS, false);
				res.redirect(linkIndex);
			})
		}
	}	
});

module.exports = router;
