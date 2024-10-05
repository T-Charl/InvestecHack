import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Router } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
  <div>
    <Router location={''} navigator={undefined}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/chat" component={ChatPage} />
      </Switch>
    </Router>
  </div>
  )
}

export default App
