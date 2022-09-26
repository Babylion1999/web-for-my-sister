const { options } = require("mongoose");

const ItemsModel 	= require(__path_schemas + 'items');
const CategoriesModel 	= require(__path_schemas + 'categories');
module.exports = {
    listItems:async(objWhere,pagination,categoryItems,sort,categoryID)=>{   
        
        await CategoriesModel.find({},{_id:1, name:1}).then((item)=>{
            categoryItems=item;
            categoryItems.unshift({_id:'allvalue',name:'Choose group'})
        });
        
        await ItemsModel.count(objWhere).then( (data) => {
            pagination.totalItems = data;
    
        });
	
        return ItemsModel
            .find(objWhere)
            .sort(sort)
            .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
            .limit(pagination.totalItemsPerPage)
    
    },
    changeStatus:(id,data)=>{
        return ItemsModel.updateOne({_id: id}, data)
    },
    changeStatusMulti: (ids,data)=>{
        return ItemsModel.updateMany({_id: ids}, data)
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
                await ItemsModel.updateOne({_id: cids[index]},data);
            }
            return Promise.resolve("Success");
        }else{
            return ItemsModel.updateOne({_id: cids}, data);
        };
    },
    delete: (id)=>{
        return ItemsModel.deleteOne({_id: id})
    },
    deleteMulti: (cids)=>{
        return ItemsModel.remove({_id: cids})
    },
    form: (id, options=null)=>{
        return ItemsModel.findById(id);
    },
    saveItems: (item,options=null)=>{
        if(options.task=='add'){
            item.created = {
				user_id: 0,
				user_name: "abc",
				time: Date.now(),
			},
            item.category ={
				id: item.category_id,
				name: item.category_name,
			}
            return new ItemsModel(item).save()

        }else if(options.task=='edit'){
            return ItemsModel.updateOne({_id: item.id}, {
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
				category:{
					id: item.category_id,
					name: item.category_name,
				}
			});
        }else if(options.task=='change-category-name'){
            return ItemsModel.updateMany({'category.id':item.id},{
                category:{
                    id:item.id,
					name: item.name,
				}
            });
        }
    }
}