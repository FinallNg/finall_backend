const mongoose = require("mongoose")
const insightSchema = new mongoose.Schema({
    username:String,
    age:Number,
    gender:String,
    acct_created:Date,
    last_login:Date,
    log_out:Date,
    total_time:String,
    num_visits:Number
},{
    timestamps:true
})

exports.Insight = mongoose.model('Insight', insightSchema)