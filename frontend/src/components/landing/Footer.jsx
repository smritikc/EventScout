import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>EventScout</h3>
          <p>Connecting people through shared experiences.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Platform</h4>
            <Link to="/discover">Discover</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 EventScout. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
