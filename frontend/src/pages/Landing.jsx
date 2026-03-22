import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';
import '../styles/landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">EventScout</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="/login?type=attendee">Login</a>
          <button className="btn-get-started" onClick={() => window.location.href='/register'}>Join Now</button>
        </div>
      </nav>

      <Hero />
      <div id="features">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
