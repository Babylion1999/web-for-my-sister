const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    title: String, 
    thumb: String,
    thumb0: String,
    thumb1: String,
    thumb2: String, 
    status: String,
    ordering: Number,
    description: String,
    special: String,
    content: String,
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

module.exports = mongoose.model(databaseConfig.col_product, schema );