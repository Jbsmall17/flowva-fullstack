import React, { useState } from 'react'
import {useLocation} from 'react-router-dom'
import axios from "axios"

const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

export default function ResetPassword() {
    const apiUrl = import.meta.env.VITE_API_URL
    const [password,setPassword] = useState("")
    const query = useQuery()
    const email = query.get("email")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [resetMessage, setResetMessage] = useState("")
    const [messageType, setMessageType] = useState("")

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    }

    const showMessage = (message,type) => {  
        setResetMessage(message)
        setMessageType(type)
        setTimeout(() => {
            setResetMessage("")
            setMessageType("")
        }, 3000);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!password){
            showMessage('Please enter your password', 'error')
            return
        }
        if(password.length < 8){
            showMessage('Password must be at least 8 characters', 'error')
            return
        }
        try{
            showMessage('Reseting password...', 'success')
            const response = await axios.post(`${apiUrl}/api/auth/reset-password`,{
                email,
                newPassword: password
            })
            if(response.status === 200){
                setPassword('')
                showMessage(response.data.message, 'success')
            }

        }catch(err){
            console.log(err)
            if(err.response.status === 400){
                showMessage(err.response.data.message, "error")
            }else if(err.response.status === 500){
                showMessage("Internal server error", "error")
            }else{
                showMessage("Something went wrong", "error")
            }
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
            
            <div className="welcome">Change password</div>
            
            <div id="forgot-message" className={`form-message ${messageType}-message`}>{resetMessage}</div>
            
            <div className="form-group">
                <label htmlFor="forgot-email">Password</label>
                <input 
                    type={`${isPasswordVisible ? "text" : "password"}`} 
                    id="forgot-email" 
                    placeholder="••••••••"
                    name={"password"}
                    value={password} 
                    onChange={(e)=> setPassword(e.target.value)}
                    // required 
                    />
                    <span onClick={togglePasswordVisibility} className='password-toggle' id="toggle-password">
                        {!isPasswordVisible ? "Show": "Hide"}
                    </span>
            </div>
            
            <button type="submit" className="btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                change password
            </button>
            
            <div className="form-footer">
                Remember your password? <a href="/login" id="show-signin-from-forgot">Sign in</a>
            </div>
        </form>
    </div>
  )
}
