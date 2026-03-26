const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');   // import config file
//const apiLimiter = require("./Middleware/rateLimiter");

const app = express();
//app.use("/", apiLimiter); // rate limit only API routes
app.use(express.json());

/* ---------- SWAGGER MIDDLEWARE ---------- */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------- ROUTES ---------- */

const userroutes = require('./Routes/userroutes');
app.use('/', userroutes);

/* ---------- DB CONNECTION + SERVER START ---------- */

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
            console.log(`Swagger URL : https://improved-barnacle-x566xjw49qw42ppp6-3000.app.github.dev/api-docs`);

        });

    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
    });

  


    
