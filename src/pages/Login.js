import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import SocialLogin from '../components/SocialLogin'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle specific login error cases
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.')
      } else if (error.message.includes('Too many requests')) {
        setError('Too many login attempts. Please try again in a few minutes.')
      } else {
        setError(error.message)
      }
    } else {
      const { data: userProfile } = await supabase
        .from('userssop')
        .select('*')
        .eq('email', email)
        .single()

      if (userProfile) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
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
        <h1>Login</h1>
        
        <SocialLogin mode="login" />
        
        <form onSubmit={handleLogin}>
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
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
              {error.includes('Invalid email or password') && (
                <div style={{ marginTop: '8px' }}>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
                    Sign up here →
                  </Link>
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <div className="spinner spinner-small" style={{ marginRight: '8px' }}></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login