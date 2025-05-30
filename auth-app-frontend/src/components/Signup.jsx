import React, { useState } from 'react'
import "../App.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;
    const [signUpObj,setSignUpObj] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [isPasswordVisible, setIsPasswordVisible] = useState({
        password: false,
        confirmPassword: false
    });
    const [signUpMessage, setSignUpMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [ShowPasswordHint, setShowPasswordHint] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState("")
    const togglePasswordVisibility = (field) => {
        setIsPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    }

    const {email,password,confirmPassword} = signUpObj

    const showMessage = (message,type) => {  
        setSignUpMessage(message)
        setMessageType(type)
        if(!email || !password || !confirmPassword || password !== confirmPassword || password.length < 8|| !passwordRegex.test(password)){
            setTimeout(() => {
                setSignUpMessage("")
                setMessageType("")
            }, 3000);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!email || !password || !confirmPassword){
            showMessage("Please fill all the fields","error")
            return
        }
        if(password !== confirmPassword){
            showMessage("Password and Confirm Password do not match", "error")
            return
        }
        if(password.length < 8){
            showMessage("Password must be at least 8 characters","error")
            return
        }
        if(!passwordRegex.test(password)){
            showMessage("Password must contain at least one letter, one number and one special character","error")
            return  
        }
        try{
            showMessage('Creating your account...', 'success');
            const response = await axios.post(`${apiUrl}/api/auth/signup`,{
                email,
                password,
                confirmPassword
            })
            if(response.status === 201){
                setSignUpMessage("")
                setMessageType("")
                sessionStorage.setItem("token", response.data.token)
                setSignUpObj({
                    email: "",
                    password: "",
                    confirmPassword: ""
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
                setSignUpMessage("")
                setMessageType("")
            }, 3000);
        }
    }


    const handleChange = (e) =>{
        const {name,value} = e.target

        if(name === "password"){
            if(value.length > 0){
                setShowPasswordHint(true)
                let strength = 0
                if (value.length > 7) strength++;
                if (value.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength++;  
                if (value.match(/([0-9])/)) strength++;
                if (value.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength++;


                if (value.length < 6) {
                    setPasswordStrength('weak');
                } else if (strength <= 2) {
                    setPasswordStrength('medium');
                } else {
                    setPasswordStrength('strong');
                };
            }else{
                setPasswordStrength('')
                setShowPasswordHint(false)
            }
        }

        setSignUpObj({
            ...signUpObj,
            [name]: value
        })
    }

  return (
    <div className='container'>
        <form onSubmit={handleSubmit} id="signup-form" className="animate-form">
            <div className="logo">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Flowva
            </div>
            
            <div className="welcome">Join Flowva today</div>
            
            <div id="signup-message" className={`form-message ${messageType}-message`}>{signUpMessage}</div>
            
            <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input 
                    type="email" 
                    id="signup-email" 
                    placeholder="you@example.com" 
                    name="email"
                    value={email}
                    onChange={handleChange}
                    // required 
                    />
            </div>
            
            <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input 
                    type={!isPasswordVisible.password ? "password" : "text"}
                    id="signup-password" 
                    placeholder="••••••••" 
                    name='password'
                    value={password}
                    onChange={handleChange}
                    // required 
                />
                <span onClick={()=>togglePasswordVisibility('password')} className="password-toggle" id="toggle-signup-password">{!isPasswordVisible.password ? "Show" : "Hide"}</span>
                <div className="password-strength">
                    <div className={`strength-meter ${passwordStrength}`} id="password-meter"></div>
                </div>
                <div style={{display : ShowPasswordHint ? "block" : "none"}} className="password-hint" id="password-hint">
                    Use at least 8 characters with a mix of letters, numbers & symbols
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input 
                    type={!isPasswordVisible.confirmPassword ? "password" : "text"} 
                    id="confirm-password" 
                    placeholder="••••••••" 
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleChange}
                    // required

                />
                <span onClick={()=>togglePasswordVisibility('confirmPassword')} className="password-toggle" id="toggle-confirm-password">
                    {!isPasswordVisible.confirmPassword ? "Show": "Hide"}
                </span>
            </div>
            
            <button type="submit" className="btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                Create account
            </button>
            
            <div className="divider">or continue with</div>
            <GoogleLogin
                onSuccess={
                    async (credentialResponse) => {
                        const credential = credentialResponse.credential;
                        setSignUpMessage("signup with google in progress...")
                        setMessageType("success")
                        const response = await axios.post(`${apiUrl}/api/auth/google-login`, {
                            idToken: credential
                        })

                        if(response.status === 200){
                            setSignUpMessage("")
                            setMessageType("")
                            sessionStorage.setItem("token", response.data.token)
                            navigate("/")
                        }  
                    }     
                }
                onError={() => {
                    showMessage('Login Failed...', "error");
                }
            }
            />
            
            <div className="form-footer">
                Already have an account? <a href="/login" id="show-signin">Sign in</a>
            </div>
        </form>
    </div>
  )
}
