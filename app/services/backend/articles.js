const { options } = require("mongoose");
const fs = require('fs');
const MainModel 	= require(__path_schemas + 'articles');
const CategoriesModel 	= require(__path_schemas + 'categories');
const fileHelpers = require(__path_helpers + 'upload');
const StringHelper 	= require(__path_helpers + 'string');
module.exports = {
    listItems:async(objWhere,pagination,categoryItems,sort,categoryID)=>{   
        
        await CategoriesModel.find({},{_id:1, name:1}).then((item)=>{
            categoryItems=item;
            categoryItems.unshift({_id:'allvalue',name:'Choose group'})
        });
        await MainModel.count(objWhere).then( (data) => {
            pagination.totalItems = data;
    
        });
        return MainModel
            .find(objWhere)
            .sort(sort)
            .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
            .limit(pagination.totalItemsPerPage)
    
    },
    listItemsFrontend: async(params = null, options = null, limit_options=null,pagination=null, objWhere=null)=>{
        
        
        if(options.task=='list-artical'){
            return MainModel
            .find({status: 'active',special:'active'})
            .select('name created category.name thumb')
            .limit(9)
            .sort({ordering:'asc'})
        }
        if(options.task=='items-all-articles'){
            return MainModel
            .find({status: 'active'})
            .select('name category.name thumb description slug')
            .sort({ordering:'asc'})
            .limit(limit_options)
        }
        if (options.task == 'items-in-category'){
           
            if(objWhere.name == undefined){
                find = {status:'active', 'category.id': params.id}; 
            }else{
                find = {status:'active', 'category.id': params.id, name: objWhere.name}
            };
            select = 'name created.user_name created.time category.name thumb content description slug';
            sort = {'created.time': 'desc'};
            await MainModel.count(find).then( (data) => {
                pagination.totalItems = data;
            }); 
            return MainModel
            .find(find).select(select).sort(sort)
            .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
            .limit(pagination.totalItemsPerPage) 
        } 
        if (options.task == 'items-news'){
            select = 'name created.user_name created.time category.name category.id  thumb content slug';
            find = {status:'active'};
            sort = {'created.time': 'desc'};   
            return MainModel
            .find(find).select(select).sort(sort).limit(3); 
        }
    },
    // -----it does not fix
    getItemsFrontend:   async (id, options = null) => {
         await MainModel.findById(id).then((result)=>{return result}).catch((errors)=>{
            return;
          });
    },
    // -----it does not fix
    changeStatus:(id,data)=>{
        return MainModel.updateOne({_id: id}, data)
    },
    changeSpecial:(id,data)=>{
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
    changeCategory:(id,newCategory,newCategoryName,options=null)=>{
        let data = { 
            category:{
                id: newCategory,
                name: newCategoryName,
            },
            modified:{
                user_id: 0,
                user_name: "0",
                time: Date.now(),
            },
    
        };
        return MainModel.updateOne({_id: id}, data)
    },
    changeOption:(id,field,isCheck,options=null)=>{
        
        return MainModel.updateOne({_id: id}, {[field]: isCheck})

    },
    delete:  async(id)=>{
        await MainModel.findById(id).then((item)=>{
            let path='public/backend/adminlte/images/articles/'+item.thumb;
            
            if(fs.existsSync(path))
            fs.unlink(path, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted /tmp/hello');
                      });
        });
       
        return MainModel.deleteOne({_id: id})
    },
    deleteMulti: async(cids)=>{
    
        if(Array.isArray(cids)){
            for (let index = 0; index < cids.$in.length; index++) {
            
                await MainModel.findById(cids.$in[index]).then((item)=>{
                    let path='public/backend/adminlte/images/articles/'+item.thumb;
                    fileHelpers.removeImg(path);            
                });
            }
        }else{
            await MainModel.findById(cids.$in).then((item)=>{
                let path='public/adminlte/images/articles/'+item.thumb;
                fileHelpers.removeImg(path);        
            });
        }
        
      
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
            item.category ={
				id: item.category_id,
				name: item.category_name,
			}
            item.slug = StringHelper.createAlias(item.slug)
            return new MainModel(item).save()

        }else if(options.task=='edit'){
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                slug: StringHelper.createAlias(item.slug),
				status: item.status,
                special: item.special,
				description: item.description,
				content: item.content,
                thumb: item.thumb,
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
            return MainModel.updateMany({'category.id':item.id},{
                category:{
                    id:item.id,
					name: item.name,
				}
            });
        }
    }
}