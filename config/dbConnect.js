const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {  
    }).then(() => {
        console.log("Database Connected Successfully");
    }).catch((error) => {
        console.log("Error occured while connecting to the db ", error);
        process.exit(1);
    })
}