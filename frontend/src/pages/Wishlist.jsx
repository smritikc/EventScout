import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, MapPin, Clock, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import gsap from 'gsap';
import { getSavedEvents, unsaveEvent } from '../services/eventService';
import toast from 'react-hot-toast';
import '../styles/wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const wishlistRef = useRef(null);

  useEffect(() => {
    fetchSavedEvents();
    
    // Entrance animation
    gsap.from(wishlistRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    // Animate items when they load
    if (savedEvents.length > 0) {
      gsap.from('.wishlist-item', {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }
  }, [savedEvents]);

  const fetchSavedEvents = async () => {
    try {
      setLoading(true);
      const events = await getSavedEvents();
      setSavedEvents(events);
    } catch {
      // Removed unused error parameter
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (eventId) => {
    try {
      // Animate removal
      gsap.to(`.wishlist-item-${eventId}`, {
        x: -100,
        opacity: 0,
        duration: 0.3,
        onComplete: async () => {
          await unsaveEvent(eventId);
          setSavedEvents(prev => prev.filter(e => e._id !== eventId));
          toast.success('Event removed from wishlist');
        }
      });
    } catch {
      // Removed unused error parameter
      toast.error('Failed to remove event');
    }
  };

  const handleClearAll = () => {
    if (savedEvents.length === 0) return;
    
    // Animate all items out
    gsap.to('.wishlist-item', {
      x: -100,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      onComplete: async () => {
        // In a real app, you'd have a bulk remove endpoint
        for (const event of savedEvents) {
          await unsaveEvent(event._id);
        }
        setSavedEvents([]);
        toast.success('Wishlist cleared');
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <h1>
            <Heart size={24} fill="#ef4444" color="#ef4444" />
            My Wishlist
          </h1>
          {savedEvents.length > 0 && (
            <button className="clear-all" onClick={handleClearAll}>
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>
      </header>

      <main className="wishlist-main" ref={wishlistRef}>
        {savedEvents.length > 0 ? (
          <div className="wishlist-grid">
            {savedEvents.map(event => (
              <div 
                key={event._id} 
                className={`wishlist-item wishlist-item-${event._id}`}
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <div className="item-image">
                  {event.images?.[0] ? (
                    <img src={event.images[0]} alt={event.title} />
                  ) : (
                    <div className="image-placeholder">
                      <Calendar size={32} />
                    </div>
                  )}
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(event._id);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="item-content">
                  <h3 className="item-title">{event.title}</h3>
                  
                  <div className="item-details">
                    <div className="detail">
                      <Clock size={14} />
                      <span>{format(new Date(event.date), 'MMM d, h:mm a')}</span>
                    </div>
                    
                    <div className="detail">
                      <MapPin size={14} />
                      <span>{event.location?.venue || 'TBD'}</span>
                    </div>
                  </div>

                  <div className="item-footer">
                    <span className="price-tag">
                      {event.price === 0 ? 'FREE' : `₹${event.price}`}
                    </span>
                    
                    <button 
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/${event._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <Heart size={80} className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save events you're interested in and they'll appear here</p>
            <button 
              className="browse-btn"
              onClick={() => navigate('/search')}
            >
              Browse Events
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;