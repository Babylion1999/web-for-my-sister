const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    
    name: String,
    slug: String,  
    status: String,
    ordering: Number,
    parentMenu: String,
    created: {
        user_id: Number,
        user_name: String,
        time: Date,
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date,
    },
});

module.exports = mongoose.model(databaseConfig.col_menubar, schema );