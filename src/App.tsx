import { Route,BrowserRouter as Router, Routes,Navigate } from "react-router-dom"
import LoginPage from "./components/login"
import Dashboard from "./components/dashboard"


function App() {

  const authenticated = !!localStorage.getItem('authorized')

  return (

    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <Navigate to="/dashboard" replace /> // Use replace to prevent duplicate entries
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>

  )
}

export default App
