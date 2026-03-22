import { Edit, Trash2, MoreVertical } from 'lucide-react';

const OrgEventTable = ({ events, loading }) => {
  if (loading) return <div className="loading-state">Loading your events...</div>;
  if (!events.length) return <div className="empty-state-org"><p>No events found. Start by creating your first event!</p></div>;

  return (
    <div className="events-table-wrapper">
      <table className="events-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Category</th>
            <th>Attendees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id}>
              <td className="event-cell">
                <div className="event-img-mini">🎨</div>
                <span>{event.title}</span>
              </td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td><span className="badge-cat">{event.category}</span></td>
              <td>{event.attendees?.length || 0}</td>
              <td>
                <span className={`status-pill ${new Date(event.date) > new Date() ? 'upcoming' : 'past'}`}>
                  {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                </span>
              </td>
              <td className="actions-cell">
                <button className="icon-btn"><Edit size={16} /></button>
                <button className="icon-btn danger"><Trash2 size={16} /></button>
                <button className="icon-btn"><MoreVertical size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrgEventTable;
