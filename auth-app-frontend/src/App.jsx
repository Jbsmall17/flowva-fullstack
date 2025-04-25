import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
// import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import Home from './Home'
import ResetPassword from './components/ResetPassword'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div className='main-container'><Login /></div>} />
        <Route path="/signup" element={<div className='main-container'><Signup /></div>} />
        <Route path="/forgotpassword" element={<div className='main-container'><ForgotPassword /></div>} />
        <Route path="/resetpassword" element={<div className='main-container'><ResetPassword /></div>} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </>
  )
}

export default App
