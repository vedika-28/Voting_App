const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to MongoDb server');
});

db.on('disconnected',()=>{
    console.log('MongoDb disconnected');
});

db.on('error',()=>{
    console.log('MongoDb connection error',err);
});

module.exports = db;