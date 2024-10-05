import './App.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import DashboardPage from './pages/Dashboard'
import Chatbot from './pages/Chatbot'
import NavTab from './components/NavTab/NavTab'

function App() {
  return (
  <div>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/chat" element={<Chatbot/>} />
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App
