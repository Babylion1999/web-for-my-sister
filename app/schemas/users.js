const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    avatar: String, 
    username: String, 
    password: String,
    status: String,
    ordering: Number,
    price: Number,
    content: String,
    group:{
        id: String,
        name: String,
    },
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

module.exports = mongoose.model(databaseConfig.col_users, schema );