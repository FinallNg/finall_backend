const { Insight } = require('../models/insights');
const { insightValidation} = require('../validations/insight.validation.js');
require('dotenv').config();


async function getInsights(req,res){
    const data = await Insight.find().select(["-createdAt","-updatedAt"])
    return res.status(200).json(data)
}



module.exports = {getInsights}
