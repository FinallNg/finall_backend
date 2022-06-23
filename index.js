const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const {connectDatabase} = require('./config/database');
const admin_router = require('./api/routes/admin.routes');
const user_router = require('./api/routes/user.routes');
connectDatabase(app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/admin', admin_router);
app.use('/api/v1/users', user_router);