import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Heart, Share2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import gsap from 'gsap';
import '../styles/event-card.css';

const EventCard = ({ event, onRSVP, onSave, className = '' }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  // Remove unused isHovered state

  const handleMouseEnter = () => {
    gsap.to(`.event-card-${event._id}`, {
      scale: 1.02,
      y: -5,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(`.event-card-${event._id}`, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(event._id);
    
    gsap.fromTo(`.save-btn-${event._id}`, 
      { scale: 1 },
      { 
        scale: 1.3, 
        color: '#ef4444',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'back.out(1.7)'
      }
    );
  };

  const handleRSVP = (e) => {
    e.stopPropagation();
    onRSVP?.(event._id);
  };

  const handleClick = () => {
    navigate(`/event/${event._id}`);
  };

  const availableSeats = event.capacity - (event.attendees?.length || 0);
  const isAlmostFull = availableSeats < 10;

  return (
    <div 
      className={`event-card event-card-${event._id} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="event-card-image">
        {event.images?.[0] ? (
          <img src={event.images[0]} alt={event.title} />
        ) : (
          <div className="event-image-placeholder">
            <Calendar size={32} />
          </div>
        )}
        
        {event.price === 0 && (
          <span className="event-badge free-badge pulse">FREE</span>
        )}
        
        {isAlmostFull && (
          <span className="event-badge limited-badge">Limited Seats</span>
        )}
      </div>

      <div className="event-card-content">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-details">
          <div className="event-detail">
            <Clock size={14} />
            <span>{format(new Date(event.date), 'MMM d, h:mm a')}</span>
          </div>
          
          <div className="event-detail">
            <MapPin size={14} />
            <span>{event.location?.venue || 'TBD'}</span>
          </div>
        </div>

        <div className="event-stats">
          <div className="stat">
            <Users size={14} />
            <span>{event.attendees?.length || 0}/{event.capacity}</span>
          </div>
          
          <div className="stat">
            <Star size={14} />
            <span>{event.rating?.average || 4.8} ({event.rating?.count || 23})</span>
          </div>
        </div>

        <div className="event-card-footer">
          <button 
            className={`save-btn save-btn-${event._id} ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} />
          </button>
          
          <button className="share-btn">
            <Share2 size={18} />
          </button>
          
          <button 
            className="rsvp-btn"
            onClick={handleRSVP}
          >
            RSVP
          </button>
        </div>

        {event.organizer && (
          <div className="event-organizer">
            <span className="organizer-label">Organized by</span>
            <span className="organizer-name">{event.organizer.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;