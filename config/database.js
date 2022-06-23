const mongoose = require('mongoose')
require('dotenv').config()
const port = process.env.PORT || 5000;

connectDatabase = async function (app){
    try{
        await mongoose.connect(process.env.DB_URI, () => {
            console.log('Database Connected');
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        })

    }
    catch(error){
        console.log(error)
    }
}

module.exports = {connectDatabase};