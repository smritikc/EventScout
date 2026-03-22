import { Calendar, Users, TrendingUp } from 'lucide-react';

const OrgSidebar = ({ activeTab, user }) => {
  return (
    <aside className="organizer-sidebar">
      <div className="org-logo">🚀 EventScout Org</div>
      <nav className="org-nav">
        <button className={activeTab === 'events' ? 'active' : ''}><Calendar size={18} /> My Events</button>
        <button className={activeTab === 'attendees' ? 'active' : ''}><Users size={18} /> Attendees</button>
        <button className={activeTab === 'analytics' ? 'active' : ''}><TrendingUp size={18} /> Analytics</button>
      </nav>
      <div className="user-info-mini">
        <div className="avatar">{user?.name?.charAt(0)}</div>
        <div className="info">
          <p>{user?.name}</p>
          <span>Organizer</span>
        </div>
      </div>
    </aside>
  );
};

export default OrgSidebar;
