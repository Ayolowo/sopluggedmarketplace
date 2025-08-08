import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Navbar = ({ user }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      <Link to="/dashboard" className="nav-logo">
        <img src="/logo.svg" alt="SoPlugged" className="logo" />
      </Link>
      
      <nav className="navbar">
        <div className="nav-container">
          {user && (
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/submit-brief" className="nav-link">
                Submit Brief
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar