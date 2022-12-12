const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    
    header: String,
    footer: String,
    contact: String,
    script: String,
});

module.exports = mongoose.model(databaseConfig.col_settings, schema );