const Joi = require('joi');

exports.adminValidation = (admin)=>{
    const adminSchema = Joi.object({

        username: Joi.string().min(3).max(50).required(),

        firstname: Joi.string().min(3).max(50),
            
        lastname: Joi.string().min(3).max(50),

        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        is_super_admin: Joi.boolean().default(false)
    
    });
    return adminSchema.validate(admin)
}

exports.loginValidation = (admin)=>{
    const loginSchema = Joi.object({
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
        
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });
    return loginSchema.validate(admin)
}