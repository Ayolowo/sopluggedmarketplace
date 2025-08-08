import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [briefs, setBriefs] = useState([])
  const [matchingBriefs, setMatchingBriefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      navigate('/login')
      return
    }

    setUser(user)
    await fetchUserProfile(user.id)
    await fetchBriefs()
  }

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('userssop')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      console.error('Error details:', error.message)
      if (error.message.includes('relation "public.userssop" does not exist')) {
        setError('Database setup incomplete. Please check your Supabase database tables.')
      } else if (error.code === 'PGRST116') {
        // No rows returned - user profile doesn't exist
        navigate('/onboarding')
        return
      } else {
        setError(`Could not load user profile: ${error.message}`)
      }
    } else if (!data) {
      navigate('/onboarding')
    } else {
      setUserProfile(data)
    }
  }

  const fetchBriefs = async () => {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching briefs:', error)
      setError('Could not load briefs')
    } else {
      setBriefs(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (userProfile && briefs.length > 0) {
      const matching = briefs.filter(brief => {
        return userProfile.skills.some(skill => 
          brief.title.toLowerCase().includes(skill.toLowerCase()) ||
          brief.description.toLowerCase().includes(skill.toLowerCase()) ||
          brief.category.toLowerCase().includes(skill.toLowerCase())
        )
      })
      setMatchingBriefs(matching)
    }
  }, [userProfile, briefs])

  const handleApply = (briefId, briefTitle) => {
    console.log(`Applied to brief: ${briefTitle} (ID: ${briefId})`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner spinner-large"></div>
        <div className="loading-text">Loading your dashboard...</div>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="dashboard-container page-transition">
      <div className="dashboard-content">
        <div className="profile-section card-animation">
          <h1>Welcome back, {userProfile?.name}!</h1>
          <div className="profile-card card">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <div className="info-item">
                <strong>Email:</strong> {userProfile?.email}
              </div>
              <div className="info-item">
                <strong>Location:</strong> {userProfile?.location}
              </div>
              <div className="info-item">
                <strong>Skills:</strong> {userProfile?.skills?.join(', ')}
              </div>
              <div className="info-item">
                <strong>Categories:</strong> {userProfile?.categories?.join(', ')}
              </div>
              <div className="info-item">
                <strong>Availability:</strong> {userProfile?.availability}
              </div>
              <div className="info-item">
                <strong>Hourly Rate:</strong> {formatCurrency(userProfile?.rate)}
              </div>
            </div>
          </div>
        </div>

        <div className="briefs-section">
          <h2>Matching Opportunities</h2>
          {matchingBriefs.length === 0 ? (
            <div className="no-briefs">
              <p>No matching briefs found at the moment.</p>
              <p>Check back later for new opportunities that match your skills!</p>
            </div>
          ) : (
            <div className="briefs-grid">
              {matchingBriefs.map(brief => (
                <div key={brief.id} className="brief-card">
                  <div className="brief-header">
                    <h3>{brief.title}</h3>
                    <span className="brief-category">{brief.category}</span>
                  </div>
                  <p className="brief-description">{brief.description}</p>
                  <div className="brief-footer">
                    <div className="brief-budget">
                      Budget: {formatCurrency(brief.budget)}
                    </div>
                    <button
                      onClick={() => handleApply(brief.id, brief.title)}
                      className="btn-primary btn-small"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {briefs.length > matchingBriefs.length && (
          <div className="all-briefs-section">
            <h2>All Available Briefs</h2>
            <div className="briefs-grid">
              {briefs.filter(brief => !matchingBriefs.some(mb => mb.id === brief.id)).map(brief => (
                <div key={brief.id} className="brief-card brief-card-secondary">
                  <div className="brief-header">
                    <h3>{brief.title}</h3>
                    <span className="brief-category">{brief.category}</span>
                  </div>
                  <p className="brief-description">{brief.description}</p>
                  <div className="brief-footer">
                    <div className="brief-budget">
                      Budget: {formatCurrency(brief.budget)}
                    </div>
                    <button
                      onClick={() => handleApply(brief.id, brief.title)}
                      className="btn-secondary btn-small"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard