const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 100 },
    slug: { min: 3, max: 100 },
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
    special: { value: 'novalue' },
    category_id: {value: 'allvalue'},
    description: { min: 90, max: 120 },
    
}

module.exports = {
    validator: (req) => {
        
       // NAME
       req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
       .isLength({ min: options.name.min, max: options.name.max })
      
         // slug
        req.checkBody('slug', util.format(notify.ERROR_NAME, options.slug.min, options.slug.max) )
        .isLength({ min: options.slug.min, max: options.slug.max })

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);
        //special
        req.checkBody('special', notify.ERROR_STATUS)
            .isNotEqual(options.special.value);
            //category
        req.checkBody('category_id', notify.ERROR_STATUS)
        .isNotEqual(options.category_id.value);
            //descriptions
        req.checkBody('description', util.format(notify.ERROR_DESCRIPTION, options.description.min, options.description.max) )
       .isLength({ min: options.description.min, max: options.description.max })
    }
}