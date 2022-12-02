const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    title: { min: 5, max: 100 },
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
    special: { value: 'novalue' },
    description: { min: 5, max: 100},
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('title', util.format(notify.ERROR_NAME, options.title.min, options.title.max) )
            .isLength({ min: options.title.min, max: options.title.max })
        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);
         //special
         req.checkBody('special', notify.ERROR_STATUS)
         .isNotEqual(options.special.value);
          //descriptions
        req.checkBody('description', util.format(notify.ERROR_DESCRIPTION, options.description.min, options.description.max) )
        .isLength({ min: options.description.min, max: options.description.max })
      
    }
}