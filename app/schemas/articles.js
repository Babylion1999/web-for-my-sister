const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    slug: String, 
    thumb: String, 
    status: String,
    ordering: Number,
    price: Number,
    content: String,
    description: String,
    special: String,
    category:{
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
    slider: {
        type: Boolean,
        default: false
    },
    toppost: {
        type: Boolean,
        default: false
    },
    breakingnews: {
        type: Boolean,
        default: false
    },
    fearture: {
        type: Boolean,
        default: false
    },
    
});

module.exports = mongoose.model(databaseConfig.col_articles, schema );