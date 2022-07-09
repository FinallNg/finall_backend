const Joi = require('joi');

exports.bankValidation = (bankAccount)=>{
    const bankAccountSchema = Joi.object({

        user_id: Joi.string().min(3).max(50).required(),

        account_id: Joi.string().min(3).max(50).required(),
            
        bankName: Joi.string().min(2),

        accountType: Joi.string(),
    
        currency: Joi.string(),

        accountName: Joi.string().min(3),

        accountNumber: Joi.string(),
        
        accountBalance: Joi.number(),

        bvn: Joi.string().allow(null)
    
    });
    return bankAccountSchema.validate(bankAccount)
}
