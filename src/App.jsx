import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './screens/homepage/HomePage'
import Header from './components/parts/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header/>
      <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<HomePage/>} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
