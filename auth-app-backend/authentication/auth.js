const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../models/users")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET
const authRouter = express.Router()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
})

authRouter.post(
    "/signup", 
    async(req,res)=>{
    try{
        const {email, password, confirmPassword} = req.body
        const user = await userModel.findOne({email})

        if(user){
            return res.status(400).json({
            message: "User already exists"
        })
        }else if(password.length < 8){
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            })
        }else if(password !== confirmPassword){
            return res.status(400).json({
                message: "Password and confirm password do not match"
            })
        }else{
            const user = await userModel.create({
                email,
                password
            })
            if(!user){
                return res.status(500).json({
                    message: "Internal server error/ User not created"
                })
            }
            const token = jwt.sign(
                {email: user.email,userId: user._id}, 
                JWT_SECRET, {expiresIn: "1h"}
            )

            return res.status(201).json({
                message: "User created successfully",
                data: user,
                token: token
            })
        }
        }catch(err){
            return res.status(500).json({
                message: "Internal server error"
            })
        }
}
)


authRouter.post(
    "/login",
    async(req,res)=>{
        try{
            const {email,password} = req.body
            const user = await userModel.findOne({email})

            if(!user){
                return res.status(400).json({
                    message: "User not found"
                })
            }else{
                const validate = await user.isValidPassword(password)
                if(!validate){
                    return res.status(400).json({
                        message: "either email or password is invalid"
                    })
                }
                const token = jwt.sign(
                    {email: user.email,userId: user._id}, 
                    JWT_SECRET, {expiresIn: "1h"}
                )

                return res.status(200).json({
                    message: "User logged in successfully",
                    token
                })
            }
        }catch(err){
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
)

authRouter.post(
    "/forgot-password",
    async(req,res)=>{
        try{
            const {email} = req.body
            const user = await userModel.findOne({email})
           if(!user){
                return res.status(400).json({
                    message: "User not found"
                })
            }
            try{
                const templatePath = path.resolve('views', 'password-reset.ejs');
                const htmlContent = await ejs.renderFile(
                    templatePath,
                    {user: {email, link: `${process.env.passord_reset_link || 'http://localhost:5173'}/resetpassword?email=${email}`}},
                )
            
                const mailOptions = {
                    from: process.env.email,
                    to: email,
                    subject: "Password reset link",
                    html: htmlContent
                }
                await transporter.sendMail(mailOptions)
                return res.status(200).json({
                    message: "Password reset link sent to your email"
                })
            }catch(err){
                return res.status(500).json({
                    message: "Internal server error / error sending mail"
                })
            }

        }catch(err){
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
)

authRouter.post(
    "/reset-password", 
    async(req,res)=>{
        try{
            const {email,newPassword} = req.body
            if(!email || !newPassword){
                return res.status(400).json({
                    message: "Email and new password are required"
                })
            }

            const user = await userModel.findOne({email})
            if(!user){
                return res.status(404).json({
                    message: "User not found"
                })
            }
            user.password = newPassword
            await user.save()

            res.status(200).json({
                message: "Password reset successfully"
            })
        }catch(err){
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
)


module.exports = authRouter