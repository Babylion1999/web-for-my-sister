const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    
    name: String,
    email: String,
    comment: String,
    slug: String,  
    status: String,
    ordering: Number,
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

module.exports = mongoose.model(databaseConfig.col_contact, schema );