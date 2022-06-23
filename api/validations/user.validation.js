const Joi = require('joi');

exports.userValidation = (user)=>{
    const userSchema = Joi.object({

        username: Joi.string().min(3).max(50).required(),

        firstname: Joi.string().min(3).max(50),
            
        lastname: Joi.string().min(3).max(50),

        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        free: Joi.boolean().default(true),

        premium: Joi.boolean().default(false)
    
    });
    return userSchema.validate(user)
}

exports.loginValidation = (user)=>{
    const loginSchema = Joi.object({
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
        
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });
    return loginSchema.validate(user)
}