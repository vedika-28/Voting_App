const express = require('express');
const app = express();
const db = require('./db')
require('dotenv').config();

// require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//Import the router files
const userRoutes = require('./routes/userRoutes.js');
const candidateRoutes = require('./routes/candidateRoutes.js');

// use the routers
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(PORT,()=>{
    console.log('listening on port 3000');
})