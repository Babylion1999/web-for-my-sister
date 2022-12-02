const { options } = require("mongoose");
const fs = require('fs');
const MainModel 	= require(__path_schemas + 'slider');
const CategoriesModel 	= require(__path_schemas + 'categories');
const fileHelpers = require(__path_helpers + 'upload');
const StringHelper 	= require(__path_helpers + 'string');
module.exports = {
    listItems:async(objWhere,pagination,categoryItems,sort,categoryID)=>{   
        
       
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
        
        
        
        if(options.task=='items-in-slider'){
            return MainModel
            .find({status: 'active'})
            .select('title description thumb status')
            .sort({ordering:'asc'})
            .limit(limit_options)
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
    delete:  async(id)=>{
        await MainModel.findById(id).then((item)=>{
            let path='public/backend/adminlte/images/slider/'+item.thumb;
            
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
                    let path='public/backend/adminlte/images/slider/'+item.thumb;
                    fileHelpers.removeImg(path);            
                });
            }
        }else{
            await MainModel.findById(cids.$in).then((item)=>{
                let path='public/adminlte/images/slider/'+item.thumb;
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
			}
            
           
            return new MainModel(item).save()

        }else if(options.task=='edit'){
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				title: item.title,
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
				
			});
        }
    }
}