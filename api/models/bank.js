const mongoose = require("mongoose")
const bankAccountSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    account_id:String,
    bankName:String,
    accountType:String,
    currency:String,
    accountName:String,
    accountNumber:String,
    accountBalance:Number,
    bvn:String
},{
    timestamps:true
})

exports.BankAccount = mongoose.model('BankAccount', bankAccountSchema)