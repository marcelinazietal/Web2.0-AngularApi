const config = require("dotenv").config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then((value)=>{
    console.log(value.connection.readyState)
})

module.exports = mongoose;