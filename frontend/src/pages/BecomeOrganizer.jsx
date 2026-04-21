import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import {  AnimatePresence } from 'framer-motion';

const BecomeOrganizer = () => {
  const { user, becomeOrganizer } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    organizationName: '',
    phone: user?.phone || ''
  });

  const handleRequestOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/organizers/request-otp`, {
        email: user.email
      });
      // In dev mode, we log or auto-fill OTP for ease of testing
      if (response.data.devOtp) {
        toast.success(`DEV MODE: Your OTP is ${response.data.devOtp}`);
      } else {
        toast.success(`OTP sent to ${user.email}`);
      }
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndUpgrade = async (e) => {
    e.preventDefault();
    if (!otp || !formData.organizationName) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const result = await becomeOrganizer({
        email: user.email,
        otp,
        organizationName: formData.organizationName,
        phone: formData.phone
      });
      
      if (result.success) {
        navigate('/organizer-dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header text-center">
          <div className="auth-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Briefcase size={40} color="var(--primary-color)" />
          </div>
          <h2>Become an Organizer</h2>
          <p>Unlock the power to host and manage amazing events on EventScout.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <div className="perks-list" style={{ textAlign: 'left', margin: '2rem 0', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <CheckCircle color="var(--primary-color)" size={20} />
                  <span>Create free and paid events instantly.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <ShieldCheck color="var(--primary-color)" size={20} />
                  <span>Host secure online and onsite sessions.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail color="var(--primary-color)" size={20} />
                  <span>Reach hundreds of users matching your category.</span>
                </div>
              </div>

              <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                We'll send a 6-digit verification code to <strong>{user?.email}</strong>.
              </p>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                onClick={handleRequestOTP}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={verifyOTPAndUpgrade}
            >
              <div className="input-group">
                <label>Verification Code (OTP)</label>
                <input
                  type="text"
                  required
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  style={{ letterSpacing: '0.2rem', textAlign: 'center', fontSize: '1.25rem' }}
                />
              </div>

              <div className="input-group">
                <label>Organization / Host Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Innovators Nepal"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Contact Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+977"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : 'Verify & Upgrade'}
              </button>
              
              <div className="text-center" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-text" onClick={() => setStep(1)}>
                  Back
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BecomeOrganizer;
