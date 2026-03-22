import { Calendar, Users, TrendingUp } from 'lucide-react';

const OrgStats = ({ stats }) => {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="icon purple"><Calendar /></div>
        <div className="data">
          <h3>{stats.totalEvents}</h3>
          <p>Total Events</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="icon green"><Users /></div>
        <div className="data">
          <h3>{stats.totalAttendees}</h3>
          <p>Total Attendees</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="icon blue"><TrendingUp /></div>
        <div className="data">
          <h3>{stats.activeEvents}</h3>
          <p>Active Events</p>
        </div>
      </div>
    </section>
  );
};

export default OrgStats;
