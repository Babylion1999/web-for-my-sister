const { options } = require("mongoose");
const fs = require('fs');
const MainModel 	= require(__path_schemas + 'settings');
const CategoriesModel 	= require(__path_schemas + 'categories');
const fileHelpers = require(__path_helpers + 'upload');
const StringHelper 	= require(__path_helpers + 'string');
module.exports = {
    listItems:async(objWhere)=>{    
        return MainModel
            .find(objWhere)
    },
    getLogo:(param=null,options =null)=>{
        if(options.task=='get-logo-header'){
            return MainModel
            .find({})
            .select('logoHeader')
        }
    },
    listItemsFrontend:(params = null, options = null)=>{
        
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
            .select('name category.name thumb')
            .sort({ordering:'asc'})
        }
            
        
       
        
    },
    
    
   
   
   
}