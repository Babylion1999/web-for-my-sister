const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    thumb: String, 
    status: String,
    ordering: Number,
    price: Number,
    content: String,
    special: String,
    category:{
        id: String,
        name: String,
    },
    created: {
        item_id: Number,
        item_name: String,
        time: Date,
    },
    modified: {
        item_id: Number,
        item_name: String,
        time: Date,
    },
    
});

module.exports = mongoose.model(databaseConfig.col_articles, schema );