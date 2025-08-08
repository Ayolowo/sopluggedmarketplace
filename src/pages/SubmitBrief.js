import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const SubmitBrief = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const categories = [
    'Marketing & Advertising',
    'Content Creation',
    'Design & Creative',
    'Technology & Development',
    'Photography & Video',
    'Social Media Management',
    'Writing & Copywriting',
    'Business & Strategy'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Please login to submit a brief')
      navigate('/login')
      return
    }

    const { error } = await supabase
      .from('briefs')
      .insert([{
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: parseFloat(formData.budget)
      }])

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: ''
      })
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }
    setLoading(false)
  }

  const isFormValid = formData.title && formData.description && formData.category && formData.budget

  return (
    <div className="submit-brief-container page-transition">
      <div className="submit-brief-card card">
        <h1>Submit a Brief</h1>
        <p className="subtitle">Post your project requirements and connect with talented creators</p>
        
        {success && (
          <div className="success-message">
            Brief submitted successfully! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Need a logo design for tech startup"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about your project requirements, timeline, and expectations..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Budget ($)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="e.g., 5000"
              min="0"
              step="0.01"
              required
            />
            <small className="form-help">Enter your total project budget</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="spinner spinner-small" style={{ marginRight: '8px' }}></div>
                Submitting...
              </>
            ) : (
              'Submit Brief'
            )}
          </button>
        </form>

        <div className="brief-tips">
          <h3>Tips for a great brief:</h3>
          <ul>
            <li>Be specific about your requirements and deliverables</li>
            <li>Include timeline and deadline information</li>
            <li>Set a realistic budget based on project scope</li>
            <li>Provide examples or references if possible</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SubmitBrief