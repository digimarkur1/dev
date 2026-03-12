const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.use(express.json());

const userroutes = require('./Routes/userroutes');
app.use('/',userroutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });

  


    
