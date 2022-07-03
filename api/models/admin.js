const mongoose = require("mongoose")
const adminSchema = new mongoose.Schema({
    username:String,
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    email:{type:String, required:true, immutable:true},
    password:{type:String, required:true, select:false},
    is_admin:{type:Boolean, default:true},
    is_super_admin:{type:Boolean, default:false},
    refreshToken:{type:String, default:'', select:false}
},{
    timestamps:true
})

exports.Admins = mongoose.model('Admin', adminSchema)