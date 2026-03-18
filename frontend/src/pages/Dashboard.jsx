import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Bell, MapPin, Search, Calendar, Heart, 
  Home, User, X, ChevronRight, Share2, Clock,
  Users, Star, Filter, Settings, LogOut, Bookmark,
  Sun, Moon, AlertCircle, CheckCircle
} from 'lucide-react';
import { format, isToday, isFuture, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { getEvents, rsvpEvent, saveEvent } from '../services/eventService';
import { getNotifications, markAsRead } from '../services/notificationService';
import EventCard from '../components/EventCard';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Dhangadhi 10km');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  
  
  // Refs for GSAP animations
  const headerRef = useRef(null);
  const greetingRef = useRef(null);
  const eventsRef = useRef(null);
  const recommendationsRef = useRef(null);
  const notificationRef = useRef(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsData, notifData] = await Promise.all([
        getEvents({ location: currentLocation }),
        getNotifications()
      ]);
      
      // Filter today's events
      const todayEvents = eventsData.filter(event => 
        isToday(new Date(event.date))
      );
      
      setEvents(todayEvents);
      
      // Get recommended events based on user preferences
      const recs = eventsData
        .filter(event => 
          user?.preferences?.categories?.includes(event.category) &&
          isFuture(new Date(event.date))
        )
        .slice(0, 6);
      
      setRecommendedEvents(recs);
      setNotifications(notifData);
      
      // Loading animation
      gsap.to('.loading-spinner', {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: 'linear'
      });
    } catch {
      // Removed unused error parameter
      toast.error('Failed to load dashboard', {
        icon: '😕',
        style: {
          border: '2px solid #ef4444',
        },
      });
    } finally {
      setLoading(false);
    }
  }, [currentLocation, user?.preferences?.categories]);

  useEffect(() => {
    fetchDashboardData();
    
    // Page entrance animations
    const tl = gsap.timeline();
    
    tl.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from(greetingRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4')
    .from(eventsRef.current?.children || [], {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    })
    .from(recommendationsRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.2');
  }, [fetchDashboardData]); // Added fetchDashboardData as dependency

  useEffect(() => {
    // Animate notification dropdown
    if (showNotifications && notificationRef.current) {
      gsap.from(notificationRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    }
  }, [showNotifications]);

  const handleRSVP = async (eventId, guests) => {
    try {
      await rsvpEvent(eventId, guests);
      
      // Success animation
      gsap.to(`.event-${eventId}`, {
        scale: 1.05,
        backgroundColor: '#d1fae5',
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
      
      toast.success('RSVP confirmed! 🎉', {
        icon: '✅',
        style: {
          border: '2px solid #10b981',
        },
      });
      fetchDashboardData();
    } catch {
      // Removed unused error parameter
      toast.error('Failed to RSVP', {
        icon: '😕',
      });
    }
  };

  const handleSave = async (eventId) => {
    try {
      await saveEvent(eventId);
      
      // Heart animation
      gsap.to(`.save-btn-${eventId}`, {
        scale: 1.3,
        color: '#ef4444',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'back.out(1.7)'
      });
      
      toast.success('Event saved! ❤️', {
        icon: '💾',
      });
    } catch {
      // Removed unused error parameter
      toast.error('Failed to save event');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Discovering amazing events for you...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard ${theme}`}>
      {/* Header */}
      <header className="dashboard-header" ref={headerRef}>
        <div className="header-left">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="notification-badge pulse">{unreadCount}</span>
            )}
          </button>
          
          <div className="location-selector">
            <MapPin size={20} className="location-icon" />
            <select 
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="location-dropdown"
            >
              <option value="Dhangadhi 10km">📍 Dhangadhi (10km)</option>
              <option value="Kailali 50km">📍 Kailali (50km)</option>
              <option value="Sudurpashchim">📍 Sudurpashchim</option>
              <option value="All Nepal">🇳🇵 All Nepal</option>
            </select>
          </div>
        </div>

        <div className="header-right">
          <button 
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <div className="profile-section">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notification-dropdown" ref={notificationRef}>
            <div className="dropdown-header">
              <h3>Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div 
                    key={notif._id}
                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notif._id)}
                  >
                    <div className="notification-icon">
                      {notif.type === 'event_update' && <Calendar size={20} />}
                      {notif.type === 'seat_alert' && <AlertCircle size={20} />}
                      {notif.type === 'recommendation' && <Heart size={20} />}
                      {notif.type === 'rsvp_status' && <CheckCircle size={20} />}
                    </div>
                    <div className="notification-content">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <span className="notification-time">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {!notif.read && <span className="unread-dot"></span>}
                  </div>
                ))
              ) : (
                <div className="no-notifications">
                  <Bell size={48} />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Menu */}
        {showProfileMenu && (
          <div className="profile-menu">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h4>{user?.name}</h4>
                <p>{user?.email}</p>
              </div>
            </div>
            
            <div className="profile-menu-items">
              <button onClick={() => navigate('/profile/preferences')}>
                <Settings size={18} />
                <span>My Preferences</span>
              </button>
              <button onClick={() => navigate('/profile/rsvps')}>
                <Calendar size={18} />
                <span>My RSVPs</span>
              </button>
              <button onClick={() => navigate('/wishlist')}>
                <Heart size={18} />
                <span>Wishlist</span>
              </button>
              <button onClick={() => navigate('/profile/settings')}>
                <User size={18} />
                <span>Account Settings</span>
              </button>
              <button className="logout-btn" onClick={logout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Greeting Section */}
        <section className="greeting-section" ref={greetingRef}>
          <h1 className="greeting">
            Good {new Date().getHours() < 12 ? 'Morning' : 
                   new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},
            <span className="user-name"> {user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="greeting-subtitle">Your events for today</p>
        </section>

        {/* Today's Events */}
        <section className="today-events" ref={eventsRef}>
          {events.length > 0 ? (
            events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onRSVP={handleRSVP}
                onSave={handleSave}
                className={`event-${event._id}`}
              />
            ))
          ) : (
            <div className="empty-state">
              <Calendar size={64} />
              <h3>No events scheduled for today</h3>
              <p>Check out our recommendations below!</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search for events..."
              onFocus={() => navigate('/search')}
            />
          </div>
          <button className="action-btn" onClick={() => navigate('/calendar')}>
            <Calendar size={24} />
          </button>
          <button className="action-btn" onClick={() => navigate('/wishlist')}>
            <Heart size={24} />
          </button>
        </section>

        {/* Recommended Events */}
        <section className="recommendations" ref={recommendationsRef}>
          <div className="section-header">
            <h2>
              <Star size={24} className="section-icon" />
              Recommended for You
            </h2>
            <button className="see-all-btn">
              See All <ChevronRight size={16} />
            </button>
          </div>

          <div className="recommendations-grid">
            {recommendedEvents.length > 0 ? (
              recommendedEvents.map(event => (
                <div 
                  key={event._id} 
                  className="recommendation-card"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="card-image">
                    {event.images?.[0] ? (
                      <img src={event.images[0]} alt={event.title} />
                    ) : (
                      <div className="image-placeholder">
                        {event.category.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3>{event.title}</h3>
                    <p className="event-time">
                      <Clock size={14} />
                      {format(new Date(event.date), 'MMM d, h:mm a')}
                    </p>
                    <div className="card-footer">
                      <span className="price-badge">
                        {event.price === 0 ? 'FREE' : `₹${event.price}`}
                      </span>
                      <div className="event-stats">
                        <Users size={14} />
                        <span>{event.attendees?.length || 0}/{event.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-recommendations">
                <p>No recommendations yet. Set your preferences!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/pref-quiz')}
                >
                  Set Preferences
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate('/dashboard')}>
          <Home size={24} />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/search')}>
          <Search size={24} />
          <span>Search</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/calendar')}>
          <Calendar size={24} />
          <span>RSVPs</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/wishlist')}>
          <Heart size={24} />
          <span>Wishlist</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/profile')}>
          <User size={24} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;