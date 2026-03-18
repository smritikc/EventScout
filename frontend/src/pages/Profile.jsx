import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, MapPin, Heart, Settings, 
  LogOut, Edit2, Camera, Star, Award, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { getUserStats, updateProfile, uploadProfilePicture } from '../services/userService';
import { getUserRSVPs } from '../services/eventService';
import toast from 'react-hot-toast';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    savedEvents: 0,
    eventsAttended: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location?.city || ''
  });
  
  const profileRef = useRef(null);
  const statsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    
    // Entrance animation
    const tl = gsap.timeline();
    
    tl.from(profileRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from(statsRef.current?.children || [], {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.3');
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userStats, rsvps] = await Promise.all([
        getUserStats(),
        getUserRSVPs()
      ]);
      
      setStats(userStats);
      
      // Get recent activity (last 3 RSVPs)
      const recent = rsvps.slice(0, 3).map(rsvp => ({
        ...rsvp,
        type: 'rsvp',
        date: new Date(rsvp.date)
      }));
      setRecentActivity(recent);
    } catch {
      // Removed unused error parameter
      toast.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview animation
    gsap.to('.profile-avatar', {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });

    try {
      await uploadProfilePicture(file);
      toast.success('Profile picture updated!');
    } catch {
      // Removed unused error parameter
      toast.error('Failed to update profile picture');
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updateProfile(editForm);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      // Removed unused error parameter
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    gsap.to('.profile-page', {
      opacity: 0,
      y: -30,
      duration: 0.5,
      onComplete: () => {
        logout();
        navigate('/login');
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>My Profile</h1>
        <button className="settings-btn" onClick={() => navigate('/profile/settings')}>
          <Settings size={20} />
        </button>
      </header>

      <main className="profile-main" ref={profileRef}>
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-cover">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button 
                className="edit-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="profile-info">
            {editing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Your name"
                  className="edit-input"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                  className="edit-input"
                  rows="3"
                />
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  placeholder="Your location"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSubmit}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-bio">{user?.bio || 'No bio yet'}</p>
                <div className="profile-meta">
                  <div className="meta-item">
                    <Mail size={16} />
                    <span>{user?.email}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{user?.location?.city || 'Location not set'}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Joined {format(new Date(user?.createdAt || Date.now()), 'MMMM yyyy')}</span>
                  </div>
                </div>
                <button className="edit-profile-btn" onClick={() => setEditing(true)}>
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" ref={statsRef}>
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalEvents}</span>
              <span className="stat-label">Total Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.upcomingEvents}</span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.savedEvents}</span>
              <span className="stat-label">Saved</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.eventsAttended}</span>
              <span className="stat-label">Attended</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div 
                  key={activity._id} 
                  className="activity-item"
                  onClick={() => navigate(`/event/${activity._id}`)}
                >
                  <div className="activity-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="activity-details">
                    <h4>{activity.title}</h4>
                    <p>You RSVP'd • {format(activity.date, 'MMM d, yyyy')}</p>
                  </div>
                  <span className="activity-status">{activity.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-activity">No recent activity</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-item" onClick={() => navigate('/wishlist')}>
            <Heart size={20} />
            <span>My Wishlist</span>
          </button>
          <button className="action-item" onClick={() => navigate('/calendar')}>
            <Calendar size={20} />
            <span>My Calendar</span>
          </button>
          <button className="action-item" onClick={() => navigate('/profile/settings')}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="action-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;