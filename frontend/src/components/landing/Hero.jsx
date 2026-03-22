import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Zap, MapPin } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="badge-new">
          <Sparkles size={14} /> New: AI Personalized Recommendations
        </div>
        <h1 className="hero-title">
          Discover Experiences that <span className="highlight">Inspire You</span>
        </h1>
        <p className="hero-subtitle">
          From silent discos to coding workshops, find local events curated specifically for your interests and location.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Get Started <Zap size={18} />
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Explore Events
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>10k+</span> Events</div>
          <div className="stat"><span>50k+</span> Users</div>
          <div className="stat"><span>20+</span> Cities</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
