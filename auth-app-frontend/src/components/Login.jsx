import React, { useState } from 'react'
import "../App.css"
import axios from "axios"
import {useNavigate} from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';

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
            
            <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                const credential = credentialResponse.credential;
                                setSignInMessage("signup with google in progress...")
                                setMessageType("success")
                                const response = await axios.post(`${apiUrl}/api/auth/google-login`, {
                                    idToken: credential
                                })
            
                                if(response.status === 200){
                                    setSignInMessage("")
                                    setMessageType("")
                                    sessionStorage.setItem("token", response.data.token)
                                    navigate("/")
                                }  
                            }     
                            }
                            onError={() => {
                                showMessage('Login Failed...', "error");
                            }}
                        />
            
            <div className="form-footer">
                Don't have an account? <a href="/signup" id="show-signup">Sign up</a>
            </div>
        </form>
    </div>
  )
}
