const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:String,
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    sex:{type:String, default:null},
    dateOfBirth:{type:String, default:null},
    accountCurrency:{type:String, default:null},
    phone:{type:String, default:null},
    email:{type:String, required:true, immutable:true},
    image:{type:String, default:null},
    password:{type:String, required:true, select:false},
    free:{type:Boolean, default:true},
    premium:{type:Boolean, default:false},
    refreshToken:{type:String, default:'', select:false},
    accessToken:{type:String, default:'', select:false}
},{
    timestamps:true
})

exports.Users = mongoose.model('Users', userSchema)