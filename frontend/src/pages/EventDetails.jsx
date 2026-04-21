import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getEventById, rsvpEvent, saveEvent } from '../services/eventService';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Clock, Users, Ticket, Heart, Share2, ArrowLeft, Star } from 'lucide-react';
import { format } from 'date-fns';
import RSVPModal from '../components/RSVPModal';
import '../styles/event-details.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        // Check if user has saved this event (assuming user object has savedEvents)
        if (user?.savedEvents?.includes(eventId)) {
          setIsSaved(true);
        }
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, navigate]);

  const handleSave = async () => {
    try {
      await saveEvent(eventId);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Event removed from wishlist' : 'Event saved to wishlist!');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleRSVPConfirm = async ({ guests, status, teamName, email }) => {
    try {
      const res = await rsvpEvent(eventId, { guests, status, teamName, email });
      toast.success(res.message || 'Your RSVP is confirmed!');
      
      // Update local state
      const updatedEvent = await getEventById(eventId);
      setEvent(updatedEvent);
      
      setShowRSVP(false);
    } catch {
      toast.error('Failed to confirm RSVP');
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) return null;

  const isFree = event.price === 0;
  const availableSeats = event.capacity - (event.attendees?.length || 0);
  const hasRSVPd = event.attendees?.some(a => a.user === user?._id);

  return (
    <div className="event-details-page section-animate">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-actions">
          <button className={`action-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
            <Heart size={22} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : 'currentColor'} />
          </button>
          <button className="action-btn">
            <Share2 size={22} />
          </button>
        </div>
      </div>

      <div className="event-hero-image">
        {event.images?.[0] ? (
          <img src={event.images[0]} alt={event.title} />
        ) : (
          <div className="event-image-placeholder">
            <span>{event.category?.charAt(0) || <Calendar size={48} />}</span>
          </div>
        )}
      </div>

      <div className="event-content">
        <div className="event-badges">
          <span className="badge category-badge">{event.category}</span>
          {isFree ? (
            <span className="badge free-badge">FREE</span>
          ) : (
            <span className="badge price-badge">Rs. {event.price}</span>
          )}
          {event.eventType === 'online' && <span className="badge online-badge">Online</span>}
        </div>

        <h1 className="event-title-lg">{event.title}</h1>
        
        <div className="organizer-info">
          <div className="org-avatar">
            {event.organizer?.name?.charAt(0) || 'O'}
          </div>
          <div className="org-details">
            <span className="org-by">Hosted by</span>
            <span className="org-name">{event.organizer?.name || 'Unknown Organizer'}</span>
          </div>
        </div>

        <div className="event-info-grid">
          <div className="info-item">
            <div className="info-icon"><Calendar size={20} /></div>
            <div className="info-text">
              <span className="info-label">Date & Time</span>
              <span className="info-value">
                {format(new Date(event.date), 'EEEE, MMMM do, yyyy')} <br/>
                {event.time || 'Time TBD'}
              </span>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon"><MapPin size={20} /></div>
            <div className="info-text">
              <span className="info-label">Location</span>
              <span className="info-value">
                {event.location?.venue || 'TBD'} <br/>
                {event.location?.city || ''}
              </span>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h3>About this event</h3>
          <p>{event.description || 'No description provided.'}</p>
        </div>
        
        <div className="event-stats-block">
          <div className="stat">
             <Users size={18} />
             <span>{availableSeats} seats left (Total: {event.capacity})</span>
          </div>
          <div className="stat">
             <Star size={18} color="#f59e0b" fill="#f59e0b"/>
             <span>{event.rating?.average || 'New'} ({event.rating?.count || 0} reviews)</span>
          </div>
          {event.participationType !== 'individual' && (
            <div className="stat">
               <Users size={18} />
               <span>Participation: {event.participationType} (Max {event.teamSizeLimit} per team)</span>
            </div>
          )}
        </div>
      </div>

      <div className="fixed-bottom-bar">
        <div className="price-col">
           <span className="price-label">Price</span>
           <span className="price-amount">{isFree ? 'Free' : `Rs. ${event.price}`}</span>
        </div>
        <button 
          className="btn-primary rsvp-primary-btn" 
          onClick={() => setShowRSVP(true)}
          disabled={availableSeats <= 0 && !hasRSVPd}
        >
          {hasRSVPd ? 'Update RSVP' : (availableSeats <= 0 ? 'Sold Out' : 'Get Tickets')}
        </button>
      </div>

      {showRSVP && (
        <RSVPModal 
          event={event} 
          onClose={() => setShowRSVP(false)}
          onConfirm={handleRSVPConfirm}
        />
      )}
    </div>
  );
};

export default EventDetails;
