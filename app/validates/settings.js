const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    copyright: { min: 5, max: 100 },
    content: {min: 5, max: 500}, 
    facebook: { min: 5, max: 100 },
    instagram: { min: 5, max: 100 },
    email: { min: 5, max: 100 },
    zalo: { min: 5, max: 100 },
    phone: { min: 5, max: 100 },
    address: { min: 5, max: 100 },
    map:{ min: 5, max: 100 },
}

module.exports = {
    validator: (req) => {
       
         // copyright
        req.checkBody('copyright', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
        .isLength({ min: options.copyright.min, max: options.copyright.max })
        //content
        req.checkBody('content', util.format(notify.ERROR_CONTENT, options.content.min, options.content.max) )
        .isLength({ min: options.content.min, max: options.content.max })
         // copyright
         req.checkBody('facebook', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
         .isLength({ min: options.copyright.min, max: options.copyright.max })
          // copyright
        req.checkBody('instagram', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
        .isLength({ min: options.copyright.min, max: options.copyright.max })
         // copyright
         req.checkBody('email', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
         .isLength({ min: options.copyright.min, max: options.copyright.max })
          // copyright
        req.checkBody('zalo', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
        .isLength({ min: options.copyright.min, max: options.copyright.max })
         // copyright
         req.checkBody('phone', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
         .isLength({ min: options.copyright.min, max: options.copyright.max })
        // copyright
        req.checkBody('address', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
        .isLength({ min: options.copyright.min, max: options.copyright.max })
       // copyright
       req.checkBody('map', util.format(notify.ERROR_COPYRIGHT, options.copyright.min, options.copyright.max) )
       .isLength({ min: options.copyright.min, max: options.copyright.max })
    }
}