import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './screens/homepage/HomePage'
import Login from './screens/login/Login'
import Header from './components/sections/Header'
import Signup from './screens/signup/signup'
import Library from './screens/library/Library'
import Dashboard from './screens/dashboard/dashboard'
import AuthCallback from './screens/auth/callback'
import Settings from './screens/settings/settings'
import Generate from './screens/generate/generate'

function App() {

  return (
    <BrowserRouter >
    
      <Header />
      
      <main style={{}}>
        <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/library' element={<Library />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/generate' element={<Generate/>} />
        <Route path="/auth/callback" element={<AuthCallback />} />

      </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
