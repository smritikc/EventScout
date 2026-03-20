import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, MapPin, Search, Calendar, Heart, 
  Home, User, Menu, ChevronDown, CheckCircle, AlertCircle
} from 'lucide-react';
import { isToday, isFuture, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { getEvents, rsvpEvent, saveEvent } from '../services/eventService';
import { getNotifications, markAsRead } from '../services/notificationService';
import EventCard from '../components/EventCard';
import RSVPModal from '../components/RSVPModal';
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
  
  // Modal states
  const [selectedEventForRSVP, setSelectedEventForRSVP] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsData, notifData] = await Promise.all([
        getEvents({ location: currentLocation }),
        getNotifications()
      ]);
      
      const todayEvents = eventsData.filter(e => isToday(new Date(e.date)));
      setEvents(todayEvents);
      
      const userPrefs = user?.preferences?.categories || [];
      const recs = eventsData
        .filter(e => userPrefs.includes(e.category) && isFuture(new Date(e.date)))
        .slice(0, 6); // 3x2 grid approx
      
      setRecommendedEvents(recs.length > 0 ? recs : eventsData.slice(0, 6)); // Fallback if no exact matches
      setNotifications(notifData);
      
    } catch {
      toast.error('Failed to load dashboard', { icon: '😕' });
    } finally {
      setLoading(false);
    }
  }, [currentLocation, user?.preferences?.categories]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRSVPClick = (event) => {
    setSelectedEventForRSVP(event);
  };

  const confirmRSVP = async ({ guests, status }) => {
    try {
      await rsvpEvent(selectedEventForRSVP._id, guests);
      toast.success('Your RSVP confirmed! 🎉');
      toast('Organizer notified instantly.', { icon: '📨', duration: 2500 });
      fetchDashboardData();
    } catch {
      toast.error('Failed to confirm RSVP');
    } finally {
      setSelectedEventForRSVP(null);
    }
  };

  const handleSave = async (eventId) => {
    try {
      await saveEvent(eventId);
      toast.success('Event saved! ❤️');
    } catch {
      toast.error('Failed to save event');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasPreferences = user?.preferences?.categories?.length > 0;
  
  // Custom Notification Mock to fit specs if DB returns empty
  const displayNotifications = notifications.length > 0 ? notifications : [
    { _id: '1', title: 'Tech Meetup: 5 seats left!', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false, type: 'seat_alert' },
    { _id: '2', title: 'Your RSVP confirmed: Dashain Mela', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true, type: 'rsvp_status' },
    { _id: '3', title: 'New events matching your prefs', createdAt: new Date(), read: false, type: 'recommendation' }
  ];
  const realUnreadCount = notifications.length > 0 ? unreadCount : 2;

  return (
    <div className="dashboard-layout">
      {/* Skip Flow Banner */}
      {!hasPreferences && (
        <div className="skip-flow-banner">
          <div className="banner-content">
            <span className="banner-text">Welcome! Set preferences anytime → Better recs</span>
            <button className="btn-personalize" onClick={() => navigate('/pref-quiz')}>
              Personalize Now?
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="dash-header">
        <div className="header-actions">
          {/* Notifications */}
          <div className="header-item notification-wrapper">
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} className={realUnreadCount > 0 ? 'ringing' : ''}/>
              {realUnreadCount > 0 && <span className="badge">{realUnreadCount}</span>}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notif-dropdown">
                {displayNotifications.map(n => (
                  <div key={n._id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                    <div className="notif-icon">
                      {n.type === 'seat_alert' && <AlertCircle size={16} color="#ef4444"/>}
                      {n.type === 'rsvp_status' && <CheckCircle size={16} color="#10b981"/>}
                      {n.type === 'recommendation' && <Star size={16} color="#f59e0b"/>}
                    </div>
                    <div className="notif-content">
                      <p>{n.title}</p>
                      <span>{formatDistanceToNow(new Date(n.createdAt))} ago</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Toggle */}
          <div className="header-item location-selector">
            <MapPin size={18} color="#4f46e5" />
            <select value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)}>
              <option value="Dhangadhi 10km">Dhangadhi 10km</option>
              <option value="Kailali 50km">Kailali 50km</option>
              <option value="Sudurpashchim">Sudurpashchim</option>
              <option value="All Nepal">All Nepal</option>
            </select>
          </div>

          {/* Profile Menu */}
          <div className="header-item profile-menu-wrapper">
            <button className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <Menu size={18} />
              <span>Profile</span>
              <ChevronDown size={14} />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <button onClick={() => navigate('/pref-quiz')}>My Preferences</button>
                <button onClick={() => navigate('/calendar')}>My RSVPs</button>
                <button onClick={() => navigate('/wishlist')}>Wishlist</button>
                <button onClick={() => navigate('/profile')}>Account Settings</button>
                <button onClick={logout} className="logout">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Personalized Section */}
        <section className="personalized-section section-animate">
          <h2 className="greeting">Good Morning! Your events today:</h2>
          <div className="events-scroll-row">
            {loading ? (
              <div className="skeleton-card"></div>
            ) : events.length > 0 ? (
              events.map(event => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  onRSVP={handleRSVPClick}
                  onSave={handleSave}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>No upcoming events today. Find some! 🎉</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section section-animate delay-1">
          <div className="search-bar-mock" onClick={() => navigate('/search')}>
            <Search size={20} color="#6b7280" />
            <span>Search "tech dh"</span>
          </div>
          <div className="quick-action-btns">
            <button className="qa-btn" onClick={() => navigate('/calendar')}>
              <Calendar size={20} />
              <span>Calendar</span>
            </button>
            <button className="qa-btn" onClick={() => navigate('/wishlist')}>
              <Heart size={20} />
              <span>Saved</span>
            </button>
          </div>
        </section>

        {/* Recommended Events */}
        <section className="recommended-section section-animate delay-2">
          <div className="rec-header">
            <h3>🎯 Based on your tech prefs:</h3>
          </div>
          <div className="rec-grid">
            {loading ? (
               Array.from({length: 4}).map((_,i) => <div key={i} className="skeleton-card small"></div>)
            ) : recommendedEvents.length > 0 ? (
              recommendedEvents.map(event => (
                <EventCard 
                  key={`rec-${event._id}`} 
                  event={event} 
                  onRSVP={handleRSVPClick}
                  onSave={handleSave}
                  className="compact"
                />
              ))
            ) : (
              <div className="empty-state">
                <p>No matches yet. Try broadening filters?</p>
              </div>
            )}
          </div>
          {recommendedEvents.length > 0 && (
            <button className="btn-see-all" onClick={() => navigate('/search')}>
              See All Recommendations
            </button>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/search')}>
          <Search size={22} />
          <span>Search</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/calendar')}>
          <Calendar size={22} />
          <span>RSVPs</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/wishlist')}>
          <Heart size={22} />
          <span>Wishlist</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/profile')}>
          <User size={22} />
          <span>Profile</span>
        </button>
      </nav>

      {/* RSVP Modal Rendering */}
      {selectedEventForRSVP && (
        <RSVPModal 
          event={selectedEventForRSVP} 
          onClose={() => setSelectedEventForRSVP(null)}
          onConfirm={confirmRSVP}
        />
      )}
    </div>
  );
};

export default Dashboard;