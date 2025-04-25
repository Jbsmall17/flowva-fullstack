const express = require("express")
const authRouter = require("./authentication/auth")
const cors = require("cors")
require("dotenv").config()
const db = require("./db/db")
const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
db.connectTodb()

app.use(cors({origin: "*"}))

app.use("/api/auth", authRouter)



app.get("/",async(_,res)=>{
    res.status(200).send("Authentication RESTful API")
})

app.listen(PORT, ()=>{
    console.log(`localhost:${PORT}`)
})