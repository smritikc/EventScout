import { Bell, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotifMenu = ({ notifications = [], show, onToggle }) => {
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => n && !n.read).length;
  
  // Mock fallback if empty
  const displayNotifications = safeNotifications.length > 0 ? safeNotifications : [
    { _id: '1', title: 'Tech Meetup: 5 seats left!', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false, type: 'seat_alert' },
    { _id: '2', title: 'Your RSVP confirmed: Dashain Mela', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true, type: 'rsvp_status' },
    { _id: '3', title: 'New events matching your prefs', createdAt: new Date(), read: false, type: 'recommendation' }
  ];
  const realUnreadCount = safeNotifications.length > 0 ? unreadCount : 2;

  return (
    <div className="header-item notification-wrapper">
      <button className="icon-btn" onClick={onToggle}>
        <Bell size={22} className={realUnreadCount > 0 ? 'ringing' : ''}/>
        {realUnreadCount > 0 && <span className="badge">{realUnreadCount}</span>}
      </button>

      {show && (
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
  );
};

export default NotifMenu;
