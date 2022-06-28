const router = require('express').Router();
const {getInsights} = require('../controller/insight.controller')
const {authorizeAdmin} = require('../middlewares/authorize')

router.get('/insights',authorizeAdmin,getInsights)

module.exports = router