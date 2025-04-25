import React, { useState } from 'react'
import axios from "axios"
import "../App.css"

export default function ForgotPassword() {
    const [email,setEmail] = useState('')
    const apiUrl = import.meta.env.VITE_API_URL
    const [forgotPassMessage, setForgotPassMessage] = useState("")
    const [messageType, setMessageType] = useState("")
  
    const showMessage = (message,type) => {  
        setForgotPassMessage(message)
        setMessageType(type)
        if(!email){
            setTimeout(() => {
                setForgotPassMessage("")
                setMessageType("")
            }, 3000);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!email){
            showMessage('Please enter your email', 'error')
            return
        }
        try{
            showMessage('Sending password reset link...', 'success')
            const response = await axios.post(`${apiUrl}/api/auth/forgot-password`,{
                email
            })
            if(response.status === 200){
                setEmail('')
                showMessage(response.data.message, 'success')
                setTimeout(() => {
                    setForgotPassMessage("")
                    setMessageType("")
                }, 3000);
            }
        }catch(err){
            if(err.response.status === 400){
                showMessage(err.response.data.message, "error")
            }else if(err.response.status === 500){
                showMessage("Internal server error", "error")
            }else{
                showMessage("Something went wrong", "error")
            }
            setTimeout(() => {
                setForgotPassMessage("")
                setMessageType("")
            }, 3000);
        }

    }

    return (
    <div className='container'>
        <form onSubmit={handleSubmit} id="forgot-form" className="animate-form">
            <div className="logo">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Flowva
            </div>
            
            <div className="welcome">Reset your password</div>
            
            <div id="forgot-message" className={`form-message ${messageType}-message`}>{forgotPassMessage}</div>
            
            <div className="form-group">
                <label htmlFor="forgot-email">Email</label>
                <input 
                    type="email" 
                    id="forgot-email" 
                    placeholder="you@example.com" 
                    name='email'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    // required 
                />
            </div>
            
            <button type="submit" className="btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Send reset link
            </button>
            
            <div className="form-footer">
                Remember your password? <a href="/login" id="show-signin-from-forgot">Sign in</a>
            </div>
        </form>
    </div>
  )
}
