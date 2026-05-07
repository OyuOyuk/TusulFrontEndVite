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

function App() {

  return (
    <BrowserRouter >
      <Header />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/library' element={<Library />} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
