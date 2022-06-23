const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:String,
    firstname: String,
    lastname: String,
    email:{type:String, required:true, immutable:true},
    password:{type:String, required:true, select:false},
    free:{type:Boolean, default:true},
    premium:{type:Boolean, default:false},
    refreshToken:{type:String, default:'', select:false}
},{
    timestamps:true
})

exports.Users = mongoose.model('Users', userSchema)