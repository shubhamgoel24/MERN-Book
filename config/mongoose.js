const env = require('./environment');
const mongoose = require('mongoose');
mongoose.connect(process.env.MERNBOOK_DB);
const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));
db.once('open',function(){
    console.log('Connected to db');
})

module.exports = db;