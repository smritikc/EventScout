import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, Info, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const OrganizerRegister = () => {
  const navigate = useNavigate();
  const { registerOrganizer } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await registerOrganizer(formData);
    
    if (result.success) {
      gsap.to('.auth-container', {
        opacity: 0,
        y: -30,
        duration: 0.5,
        onComplete: () => navigate('/organizer-dashboard')
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page organizer-theme">
      <div className="auth-container">
        <div className="auth-card" ref={formRef}>
          <div className="auth-header">
            <h1 className="auth-title">Host Experiences 🚀</h1>
            <p className="auth-subtitle">Create an organizer account and start hosting events</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label"><User size={18} /> Contact Name *</label>
              <input 
                type="text" name="name" className="form-input" 
                placeholder="Your full name" required onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Building size={18} /> Organization Name (Optional)</label>
              <input 
                type="text" name="organizationName" className="form-input" 
                placeholder="e.g. Creative Hub" onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={18} /> Work Email *</label>
              <input 
                type="email" name="email" className="form-input" 
                placeholder="org@example.com" required onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Lock size={18} /> Password *</label>
              <input 
                type="password" name="password" className="form-input" 
                placeholder="Min 6 characters" required onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Info size={18} /> Brief Bio (Optional)</label>
              <textarea 
                name="bio" className="form-input" rows="3" 
                placeholder="Tell us about your organization..." onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <div className="spinner-small"></div> : (
                <>Register as Organizer <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login?type=organizer">Sign In</Link></p>
            <p className="mt-2"><Link to="/register" className="text-sm">Register as Attendee instead</Link></p>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>Reach Your Audience</h2>
            <p>Join 1,000+ organizers who trust EventScout to power their communities.</p>
            <div className="feature-list">
              <div className="feature-item"><span>📊</span> <span>Advanced Analytics</span></div>
              <div className="feature-item"><span>🚀</span> <span>Easy Promotion</span></div>
              <div className="feature-item"><span>💳</span> <span>Secure Payments</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegister;
