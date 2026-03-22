import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';

const ProfileMenu = ({ user, show, onToggle, logout, updateRole }) => {
  const navigate = useNavigate();

  return (
    <div className="header-item profile-menu-wrapper">
      <button className="profile-trigger" onClick={onToggle}>
        <Menu size={18} />
        <span>Profile</span>
        <ChevronDown size={14} />
      </button>

      {show && (
        <div className="profile-dropdown">
          <button onClick={() => navigate('/pref-quiz')}>My Preferences</button>
          <button onClick={() => navigate('/calendar')}>My RSVPs</button>
          <button onClick={() => navigate('/wishlist')}>Wishlist</button>
          <button onClick={() => navigate('/profile')}>Account Settings</button>
          
          {user?.role === 'organizer' ? (
            <button onClick={() => navigate('/organizer-dashboard')} className="special-link">
              Organizer Dashboard
            </button>
          ) : (
            <button onClick={async () => {
              const res = await updateRole('organizer');
              if (res.success) navigate('/organizer-dashboard');
            }} className="special-link">
              Become an Organizer
            </button>
          )}
          <button onClick={logout} className="logout">Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
