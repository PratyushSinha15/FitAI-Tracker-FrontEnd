import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import PushupCounter from './components/PushupCounter'
import ShoulderTapCounter from './components/ShoulderTapCounter'
import SquatCounter from "./components/SquatsCount";
import PlankTimer from "./components/PlankTimer";
import Layout from "./components/Layout";
// import Landing from "./components/Landing";
import Home from "./components/Home";
import Signup from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Training from "./components/Training";
import Profile from "./components/Profile";
import Learning from "./components/Learnings";

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<Signup/>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/training" element={<Training />} />
            <Route path="/learning" element={<Learning/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/pushups" element={<PushupCounter />} />
            <Route path="/shoulder-taps" element={<ShoulderTapCounter />} />
            <Route path="/squats" element={<SquatCounter/>} />
            <Route path="/plank" element={<PlankTimer />} />
          </Route>
        </Routes>
      </Layout>
      
    </Router>
  )
}

export default App
