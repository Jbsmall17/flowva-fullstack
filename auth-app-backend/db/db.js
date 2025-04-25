const mongoose = require("mongoose")
// require("dotenv").config()

const MONGODB_URL = process.env.MONGODB_URL

async function connectTodb(){
    mongoose.connect(MONGODB_URL)


    mongoose.connection.on("connected",()=>{
        console.log("connect successfully to mongodb")
    })

    mongoose.connection.on("error", ()=>{
        console.log("error connecting to mongodb")
    })

}


module.exports = {connectTodb}