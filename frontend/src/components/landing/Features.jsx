import { Compass, ShieldCheck, Heart, Share2 } from 'lucide-react';

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">Why EventScout?</h2>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><Compass /></div>
          <h3>Smart Discovery</h3>
          <p>Our AI learns your taste and suggests events you'll actually love.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><ShieldCheck /></div>
          <h3>Verified Organizers</h3>
          <p>We vet all event hosts to ensure safe and high-quality experiences.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Heart /></div>
          <h3>Seamless Booking</h3>
          <p>RSVP and save events with a single tap. It's THAT easy.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Share2 /></div>
          <h3>Social Connection</h3>
          <p>See where your friends are going and plan the perfect outing.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
