const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    name:{type:String, required:true},
    amount:{type:Number, required:true}
},{
    timestamps:true
}
)

exports.Budget = mongoose.model('Budgets', budgetSchema);