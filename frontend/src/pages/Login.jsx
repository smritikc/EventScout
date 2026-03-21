import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef(null);
  const illustrationRef = useRef(null);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Button animation
    gsap.to('.submit-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      gsap.to('.auth-container', {
        opacity: 0,
        y: -30,
        duration: 0.5,
        onComplete: () => navigate('/dashboard')
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" ref={formRef}>
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back! 👋</h1>
            <p className="auth-subtitle">Sign in to continue your event journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={18} />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input password-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-small"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create Account
              </Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button 
              type="button" 
              className="social-btn google"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Google
            </button>
            <button 
              type="button" 
              className="social-btn facebook"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`}
            >
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
              Facebook
            </button>
          </div>
        </div>

        <div className="auth-illustration" ref={illustrationRef}>
          <div className="illustration-content">
            <h2>Discover Amazing Events</h2>
            <p>Join thousands of event enthusiasts finding their perfect experiences</p>
            <div className="floating-elements">
              <div className="floating-element">🎭</div>
              <div className="floating-element">🎵</div>
              <div className="floating-element">⚽</div>
              <div className="floating-element">🍜</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;