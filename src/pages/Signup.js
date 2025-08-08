import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import SocialLogin from '../components/SocialLogin'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First check if user already exists in our database
      const { data: existingUser } = await supabase
        .from('userssop')
        .select('email')
        .eq('email', email)
        .single()

      if (existingUser) {
        setError('This email is already registered. Please login instead.')
        setLoading(false)
        return
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        // Handle signup errors
        if (error.message.includes('Email rate limit exceeded')) {
          setError('Too many signup attempts. Please try again in a few minutes.')
        } else if (error.message.includes('weak_password') || error.message.includes('Password')) {
          setError('Password must be at least 6 characters long.')
        } else if (error.message.includes('User already registered')) {
          setError('This email is already registered. Please login instead.')
        } else {
          setError(error.message)
        }
      } else if (data?.user) {
        // Successful signup
        navigate('/onboarding')
      }
    } catch (err) {
      // If the database query fails (user doesn't exist), proceed with signup
      if (err.code === 'PGRST116') {
        // User doesn't exist, proceed with signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else if (data?.user) {
          navigate('/onboarding')
        }
      } else {
        setError('An error occurred. Please try again.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-container page-transition">
      <div className="creator-collage">
        <img src={require('../assets/creators/IMG_8285.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/cupzt8ucewvoomex9mwz.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/jr1c70vzlauigz1r5b0y.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/lsc3cyta7thrkesdlmah.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/t4xv9kxbtvocuzegihuo.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/ukhsdlx3azo4xangweuy.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/vagmykblvwkor5rnlljn.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/yb8ra4lqaoifm0nqguks.webp')} alt="Creator" className="creator-image" />
        <img src={require('../assets/creators/zxm4prdsdoxcmick3woc.webp')} alt="Creator" className="creator-image" />
      </div>
      <div className="auth-card">
        <h1>Sign Up</h1>
        
        <SocialLogin mode="sign up" />
        
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
              {error.includes('already registered') && (
                <div style={{ marginTop: '8px' }}>
                  <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
                    Go to Login →
                  </Link>
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <div className="spinner spinner-small" style={{ marginRight: '8px' }}></div>
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup