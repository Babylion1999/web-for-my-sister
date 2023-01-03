const { options } = require("mongoose");
const fs = require('fs');

const UsersModel 	= require(__path_schemas + 'users');
const GroupsModel 	= require(__path_schemas + 'groups');
const removeHelper 	= require(__path_helpers + 'upload');
module.exports = {
    listItems:async(objWhere,pagination,groupItems,sort,groupID)=>{   
        
        await GroupsModel.find({},{_id:1, name:1}).then((item)=>{
            groupItems=item;
            groupItems.unshift({_id:'allvalue',name:'Choose group'})
        });
        
        await UsersModel.count(objWhere).then( (data) => {
            pagination.totalItems = data;
    
        });
	
        return UsersModel
            .find(objWhere)
            .sort(sort)
            .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
            .limit(pagination.totalItemsPerPage)
    
    },
    getItem:(id)=>{
        return UsersModel.findById(id)
    },
    changeStatus:(id,data)=>{
        
        return UsersModel.updateOne({_id: id}, data)
    },
    changeStatusMulti: (ids,data)=>{
        return UsersModel.updateMany({_id: ids}, data)
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
                await UsersModel.updateOne({_id: cids[index]},data);
            }
            return Promise.resolve("Success");
        }else{
            return UsersModel.updateOne({_id: cids}, data);
        };
    },
    delete:  async(id)=>{
        await UsersModel.findById(id).then((item)=>{
                let path='public/adminlte/images/'+item.avatar;
                // removeHelper.removeImg(path);
            if(fs.existsSync(path))
            fs.unlink(path, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted /tmp/hello');
                      });
        });
       
        return UsersModel.deleteOne({_id: id})
    },
    deleteMulti: async(cids)=>{
        console.log(cids);
        if(Array.isArray(cids)){
            for (let index = 0; index < cids.$in.length; index++) {
            
                await UsersModel.findById(cids.$in[index]).then((item)=>{
                    let path='public/adminlte/images/'+item.avatar;
                    removeHelper.removeImg(path);            
                });
            }
        }else{
            await UsersModel.findById(cids.$in).then((item)=>{
                let path='public/adminlte/images/'+item.avatar;
                removeHelper.removeImg(path);        
            });
        }
        
      
        return UsersModel.remove({_id: cids})
    },
    form: (id, options=null)=>{
        return UsersModel.findById(id);
    },
    getItemByUsername: (username, options = null) => {
        if(options == null) {
            return UsersModel.find({status:'active', username: username})
                            .select('username password avatar status group.name')
        } 
    },
    saveItems: (item,options=null)=>{
        if(options.task=='add'){
            
            item.created = {
				user_id: 0,
				user_name: "abc",
				time: Date.now(),
			},
            item.group ={
				id: item.group_id,
				name: item.group_name,
			}
            return new UsersModel(item).save()

        }else if(options.task=='edit'){
            return UsersModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
				status: item.status,
				price: item.price,
				content: item.content,
                avatar: item.avatar,
				modified:{
					user_id: 0,
					user_name: "0",
					time: Date.now(),
				},
				group:{
					id: item.group_id,
					name: item.group_name,
				}
			});
        }else if(options.task=='change-group-name'){
            return UsersModel.updateMany({'group.id':item.id},{
                group:{
                    id:item.id,
					name: item.name,
				}
            });
        }
    }
}