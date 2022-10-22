const { options } = require("mongoose");
const ArticlesModel 	= require(__path_schemas + 'articles');
const MainModel 	= require(__path_schemas + 'categories');
const StringHelper 	= require(__path_helpers + 'string');
module.exports = {
    listItems:async(objWhere,pagination)=>{   
        await MainModel.count(objWhere).then( (data) => {
            pagination.totalItems = data;
        
        });  
        return  MainModel
		.find(objWhere)
        .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
		.limit(pagination.totalItemsPerPage)  
        
    },
    listItemsFrontend:(params = null, options = null)=>{
        if(options.task=='items-in-menu'){
            return MainModel
            .find({status: 'active'})
            .select('name slug')
            .limit(10)
            .sort({ordering:'asc'})
        };
        
    },
    listItemsSelectBox:()=>{
        return MainModel.find({},{_id:1, name:1})
    },
    changeStatus:(id,data)=>{
        return MainModel.updateOne({_id: id}, data)
    },
    changeStatusMulti: (ids,data)=>{
        return MainModel.updateMany({_id: ids}, data)
    },
    changeOrdering: async(orderings,cids,options=null)=>{
        let data = { ordering: parseInt(orderings),
            modified:{
                user_id: 0,
                user_name: "0",
                time: Date.now(),
            },
    
        };
        if(Array.isArray(cids)) {
            for (let index = 0; index < cids.length; index++) {
                data.ordering= parseInt(orderings[index]);
                await MainModel.updateOne({_id: cids[index]},data);
            }
            return Promise.resolve("Success");
        }else{
            
            return MainModel.updateOne({_id: cids}, data);
        };
    },
    delete: (id)=>{
        return MainModel.deleteOne({_id: id})
    },
    deleteMulti: (cids)=>{
        return MainModel.remove({_id: cids})
    },
    form: (id, options=null)=>{
        return MainModel.findById(id);
    },
    saveItems: (item,options=null)=>{
        if(options.task=='add'){
            item.created = {
				user_id: 0,
				user_name: "abc",
				time: Date.now(),
			},
            item.slug = StringHelper.createAlias(item.slug)
            return new MainModel(item).save();

        }else if(options.task=='edit'){
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                slug: StringHelper.createAlias(item.slug),
				status: item.status,
				price: item.price,
				content: item.content,
                group_acp: item.group_acp,
				modified:{
					user_id: 0,
					user_name: "0",
					time: Date.now(),
				},
			});
        }
    }
}