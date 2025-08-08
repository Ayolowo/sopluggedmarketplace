import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    skills: '',
    categories: [],
    availability: '',
    rate: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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

  const availabilityOptions = [
    'Full-time (40+ hours/week)',
    'Part-time (20-40 hours/week)',
    'Freelance (Project-based)',
    'Weekends only',
    'Evenings only'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Please login first')
      navigate('/login')
      return
    }

    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)

    const { error } = await supabase
      .from('userssop')
      .insert([{
        id: user.id,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        skills: skillsArray,
        categories: formData.categories,
        availability: formData.availability,
        rate: parseFloat(formData.rate)
      }])

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const isStep1Valid = formData.name && formData.email && formData.location
  const isStep2Valid = formData.skills && formData.categories.length > 0
  const isStep3Valid = formData.availability && formData.rate

  return (
    <div className="onboarding-container page-transition">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`progress-step ${currentStep >= step ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="progress-line">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="step-content">
          {currentStep === 1 && (
            <div className="step">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step">
              <h2>Skills & Categories</h2>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, UI/UX Design"
                  required
                />
              </div>
              <div className="form-group">
                <label>Categories (select all that apply)</label>
                <div className="checkbox-group">
                  {categories.map(category => (
                    <label key={category} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step">
              <h2>Availability & Rate</h2>
              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Hourly Rate ($)</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="step-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrevious} className="btn-secondary">
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid)
              }
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStep3Valid || loading}
              className={`btn-primary ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? (
                <div className="spinner spinner-small"></div>
              ) : (
                'Complete Profile'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding