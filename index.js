const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const {connectDatabase} = require('./config/database');
const admin_router = require('./api/routes/admin.routes');
const insight_router = require('./api/routes/insight.routes');
const user_router = require('./api/routes/user.routes');
const product_router = require('./api/routes/product.routes');
connectDatabase(app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/admin',insight_router);
app.use('/api/admin', admin_router);
app.use('/api/v1/users', user_router);
app.use('/api/v1/users/', product_router);
app.get('/',(req,res)=>{
    return res.status(200).json({message:"Welcome to the first version of the finall api"})
})
app.get('/home',(req, res)=>{
    return res.sendFile(path.join(__dirname, 'index.html'))
})