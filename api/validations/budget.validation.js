const Joi = require('joi');

exports.budgetValidation = (budget)=>{
    const budgetSchema = Joi.object({
        name: Joi.string().min(3).required(),
        amount: Joi.number()
    });
    return budgetSchema.validate(budget)
}