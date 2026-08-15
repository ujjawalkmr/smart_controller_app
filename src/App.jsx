import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import WifiConnection from './component/WifiConnection.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Navbar from './Component/Navbar.jsx'
import PageRoutes from './Routes/PageRoutes.jsx'

function App() {
  return (
    <div>
      {/* <Navbar /> */}
      <PageRoutes />
      {/* <Dashboard /> */}
      {/* <WifiConnection/> */}
    </div>
  );
 
}

export default App
