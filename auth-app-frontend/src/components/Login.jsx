import React, { useState } from 'react'
import "../App.css"
import axios from "axios"
import {useNavigate} from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const [sigInObj,setSignInObj] = useState({
        email: "",
        password: ""
    })
    const [signInMessage, setSignInMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {email,password} = sigInObj

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    }
    const handleChange = (e) =>{
        const {name,value} = e.target
        setSignInObj((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const showMessage = (message,type) => {  
        setSignInMessage(message)
        setMessageType(type)
        if(!email || !password){
            setTimeout(() => {
                setSignInMessage("")
                setMessageType("")
            }, 3000);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!email || !password){
            showMessage("Please fill all the fields","error")
            return
        }
        try{
            showMessage('Signing in...', 'success');
            const response = await axios.post(`${apiUrl}/api/auth/login`,{
                email,
                password
            })
            if(response.status === 200){
                setSignInMessage("")
                setMessageType("")
                sessionStorage.setItem("token",response.data.token)
                setSignInObj({
                    email: "",
                    password: ""
                })
                navigate("/")
            }
        }catch(err){
            if(err.response.status === 400){
                showMessage(err.response.data.message, "error")
            }else if(err.response.status === 500){
                showMessage(err.response.data.message, "error")
            }else{
                showMessage("Something went wrong", "error")
            }
            setTimeout(() => {
                setSignInMessage("")
                setMessageType("")
            }, 3000);
        }
    }

  return ( 
    <div className="container">
        <form onSubmit={handleSubmit} id="signin-form" className="animate-form">
            <div className="logo">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Flowva
            </div>
            
            <div className="welcome">Welcome back</div>
            
            <div id="signin-message" className={`form-message ${messageType}-message`}>{signInMessage}</div>
            
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email"
                    name={"email"}
                    value={email}
                    onChange={handleChange} 
                    placeholder="you@example.com" 
                    // required 
                    />
            </div>
            
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                    type={!isPasswordVisible ? "password" : "text"} 
                    id="password" 
                    placeholder="••••••••"
                    name={"password"}
                    value={password}
                    onChange={handleChange}
                    // required 
                />
                <span onClick={togglePasswordVisibility} className="password-toggle" id="toggle-password">{!isPasswordVisible ? "Show": "Hide"}</span>
            </div>
            
            <div className="forgot-password">
                <a href="/forgotpassword" id="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" className="btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Sign in
            </button>
            
            <div className="divider">or continue with</div>
            
            <button type="button" className="btn btn-secondary" id="google-login">
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
            </button>
            
            <div className="form-footer">
                Don't have an account? <a href="/signup" id="show-signup">Sign up</a>
            </div>
        </form>
    </div>
  )
}
