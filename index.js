const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const {connectDatabase} = require('./config/database');
const admin_router = require('./api/routes/admin.routes');
const insight_router = require('./api/routes/insight.routes');
const user_router = require('./api/routes/user.routes');
const account_router = require('./api/routes/account.routes');
const budget_router = require('./api/routes/budget.routes')
connectDatabase(app);

const corsOptions = {
    origin:"*" //["https://finall-app-development.herokuapp.com", "https://finall-app.herokuapp.com"]
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api/admin',insight_router);
app.use('/api/admin', admin_router);
app.use('/api/v1/users', user_router);
app.use('/api/v1/users/', account_router);
app.use('/api/v1/users/', budget_router);
app.get('/',(req,res)=>{
    return res.status(200).json({message:"Welcome to the first version of the finall api"})
})
app.get('/home',(req, res)=>{
    return res.sendFile(path.join(__dirname, 'index.html'))
})