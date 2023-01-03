const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 30 },
    email: { min: 5, max: 30 },
    comment: {min: 5, max: 30},
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
    
    
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })
        // EMAIL
        req.checkBody('email', util.format(notify.ERROR_NAME, options.email.min, options.email.max) )
            .isLength({ min: options.email.min, max: options.email.max })
        // COMMENT
        req.checkBody('comment', util.format(notify.ERROR_NAME, options.comment.min, options.comment.max) )
        .isLength({ min: options.comment.min, max: options.comment.max })
        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        
    }
}