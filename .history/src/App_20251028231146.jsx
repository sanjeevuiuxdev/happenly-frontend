import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AiAssistant from './pages/AiAssistant'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <>
      <AppNavbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<div className="text-center text-muted">Not Found</div>} />
          <Route path="/ai" element={<AI />} />
        </Routes>
      </div>
    </>
  )
}