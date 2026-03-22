import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
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
import NotifMenu from '../components/dashboard/NotifMenu';
import ProfileMenu from '../components/dashboard/ProfileMenu';
import RecommendationGrid from '../components/dashboard/RecommendationGrid';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateRole } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('All Nepal');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedEventForRSVP, setSelectedEventForRSVP] = useState(null);

  const categoriesStr = user?.preferences?.categories?.join(',') || '';

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsDataRaw, notifDataRaw] = await Promise.all([
        getEvents({ location: currentLocation }),
        getNotifications()
      ]);
      
      const eventsData = eventsDataRaw || [];
      const notifData = notifDataRaw || [];
      
      const todayEvents = eventsData.filter(e => e.date && isToday(new Date(e.date)));
      setEvents(todayEvents);
      
      const userPrefs = categoriesStr ? categoriesStr.split(',') : [];
      const recs = eventsData
        .filter(e => e.category && userPrefs.includes(e.category) && isFuture(new Date(e.date)))
        .slice(0, 6);
      
      setRecommendedEvents(recs.length > 0 ? recs : eventsData.slice(0, 6));
      setNotifications(notifData);
      
    } catch {
      toast.error('Failed to load dashboard', { icon: '😕' });
    } finally {
      setLoading(false);
    }
  }, [currentLocation, categoriesStr]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Entrance animation when data is loaded
  useEffect(() => {
    if (!loading) {
      gsap.from('.section-animate', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all' // Clean up inline styles after animation
      });
    }
  }, [loading]);

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

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => n && !n.read).length;
  const hasPreferences = user?.preferences?.categories?.length > 0;
  
  // Custom Notification Mock to fit specs if DB returns empty
  const displayNotifications = safeNotifications.length > 0 ? safeNotifications : [
    { _id: '1', title: 'Tech Meetup: 5 seats left!', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false, type: 'seat_alert' },
    { _id: '2', title: 'Your RSVP confirmed: Dashain Mela', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true, type: 'rsvp_status' },
    { _id: '3', title: 'New events matching your prefs', createdAt: new Date(), read: false, type: 'recommendation' }
  ];
  const realUnreadCount = safeNotifications.length > 0 ? unreadCount : 2;

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
          <NotifMenu 
            notifications={notifications} 
            show={showNotifications} 
            onToggle={() => setShowNotifications(!showNotifications)} 
          />

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
          <ProfileMenu 
            user={user} 
            show={showProfileMenu} 
            onToggle={() => setShowProfileMenu(!showProfileMenu)}
            logout={logout}
            updateRole={updateRole}
          />
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
          <RecommendationGrid 
            events={recommendedEvents} 
            loading={loading} 
            onRSVP={handleRSVPClick} 
            onSave={handleSave} 
          />
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