const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const shortid = require("shortid")

const Schema = mongoose.Schema

const userSchema = new Schema({
    _id : {
        type: String,
        default: shortid.generate   
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
})

userSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")){
        const hash = await bcrypt.hash(user.password, 10)
        user.password = hash
    }
    next()
})


userSchema.methods.isValidPassword = async function(password){
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    return compare
}


const userModel = mongoose.model("users", userSchema)
module.exports = userModel