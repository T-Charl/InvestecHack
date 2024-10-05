import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Navbar from './components/Navbar/Navbar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<div className='flex flex-row w-[100%]'>
      <div className='w-[15%] h-[100vh]'>
      <Navbar/>
      </div>
      <div className='w-[85%]'>
        <App />
      </div>
    </div>
  </StrictMode>,
)
