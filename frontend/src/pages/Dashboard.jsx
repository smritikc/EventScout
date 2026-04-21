import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Bell, MapPin, Search, Calendar, Heart, 
  Home, User, Menu, ChevronDown, CheckCircle, AlertCircle,
  Crosshair, Send, CalendarSearch
} from 'lucide-react';
import { isToday, isFuture, isPast, formatDistanceToNow } from 'date-fns';
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
  const { isDark, toggleTheme } = useTheme();
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

      // Sort all events by date ascending (soonest first)
      const sorted = [...eventsData].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Top row: events happening today OR in the future
      const upcomingEvents = sorted.filter(
        e => e.date && (isToday(new Date(e.date)) || isFuture(new Date(e.date)))
      );
      // If no upcoming events, show all events (supports past data in Atlas)
      setEvents(upcomingEvents.length > 0 ? upcomingEvents : sorted);
      
      // Recommendations: prefer future events matching user prefs
      const userPrefs = categoriesStr ? categoriesStr.split(',') : [];
      const matched = sorted.filter(
        e => e.category && userPrefs.includes(e.category) && isFuture(new Date(e.date))
      ).slice(0, 6);

      // Fallback 1: any events matching prefs (ignore date)
      // Fallback 2: just show all sorted events
      if (matched.length > 0) {
        setRecommendedEvents(matched);
      } else if (userPrefs.length > 0) {
        const anyMatch = sorted.filter(e => e.category && userPrefs.includes(e.category)).slice(0, 6);
        setRecommendedEvents(anyMatch.length > 0 ? anyMatch : sorted.slice(0, 6));
      } else {
        setRecommendedEvents(sorted.slice(0, 6));
      }

      setNotifications(notifData);
      
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [currentLocation, categoriesStr]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    // Only runs once on mount to check for payment redirect query params
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const eventId = params.get('eventId');
      const pendingStr = localStorage.getItem('pendingRSVP');
      
      if (pendingStr) {
        try {
          const pending = JSON.parse(pendingStr);
          if (pending.eventId === eventId) {
            rsvpEvent(eventId, { 
              guests: pending.guests, 
              status: 'confirmed', 
              teamName: pending.teamName,
              email: pending.email 
            })
              .then((res) => {
                toast.success(res.message || 'Payment successful! Your RSVP is confirmed.');
                fetchDashboardData();
              })
              .catch(() => toast.error('Payment succeeded but RSVP failed. Please contact support.'));
            localStorage.removeItem('pendingRSVP');
          }
        } catch(e) {
          toast.success('Payment successful!');
        }
      } else {
        toast.success('Payment successful!');
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('payment') === 'cancelled') {
      toast.error('Payment was cancelled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const confirmRSVP = async ({ guests, status, teamName, email }) => {
    try {
      const res = await rsvpEvent(selectedEventForRSVP._id, { guests, status, teamName, email });
      toast.success(res.message || 'Your RSVP confirmed!');
      toast('Organizer notified instantly.', { icon: <Send size={16} color="#4f46e5" />, duration: 2500 });
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
      toast.success('Event saved!');
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

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Theme Toggle placeholder (In a real app, bind to context) */}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ fontSize: '1.1rem', padding: '0.35rem' }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Profile Menu */}
            <ProfileMenu 
              user={user} 
              show={showProfileMenu} 
              onToggle={() => setShowProfileMenu(!showProfileMenu)}
              logout={logout}
              updateRole={updateRole}
            />
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Personalized Section */}
        <section className="personalized-section section-animate">
          <h2 className="greeting">Upcoming Events</h2>
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
                <p><CalendarSearch size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />No upcoming events today. Find some!</p>
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
            {!user?.isOrganizer && (
              <button 
                className="qa-btn" 
                style={{ background: 'var(--primary-color)', color: 'white' }}
                onClick={() => navigate('/become-organizer')}
              >
                <Crosshair size={20} color="white" />
                <span>Host Event</span>
              </button>
            )}
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
            <h3><Crosshair size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#4f46e5' }} /> Based on your tech prefs:</h3>
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