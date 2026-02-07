
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/layout/Home'
import Daily from './components/layout/Daily'
import PushupSkillTree from './components/reactflow/SkillTree'

function App() {
 
  return (
        <>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/skill-tree" element={<PushupSkillTree />} />
                <Route path="/profile" element={<div>Profile</div>} />
            </Routes>
        </Router>
        </>
  )
}

export default App
