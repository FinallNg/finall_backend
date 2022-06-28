const Joi = require('joi');

exports.insightValidation = (insight)=>{
    const insightSchema = Joi.object({

        user_name: Joi.string().min(3).max(50).required(),

        age: Joi.number(),
            
        gender: Joi.string().min(3).max(50),

        acct_created: Joi.date(),
    
        last_login: Joi.date(),

        log_out: Joi.date(),

        total_time: Joi.string(),

        num_visits: Joi.number(),

        logged_in: Joi.bool()
    
    });
    return insightSchema.validate(insight)
}
