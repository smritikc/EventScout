import EventCard from '../EventCard';

const RecommendationGrid = ({ events = [], loading, onRSVP, onSave }) => {
  const safeEvents = Array.isArray(events) ? events : [];
  if (loading) {
    return (
      <div className="rec-grid">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-card small"></div>)}
      </div>
    );
  }

  if (!safeEvents.length) {
    return (
      <div className="empty-state">
        <p>No matches yet. Try broadening filters?</p>
      </div>
    );
  }

  return (
    <div className="rec-grid">
      {safeEvents.map(event => (
        <EventCard 
          key={`rec-${event._id}`} 
          event={event} 
          onRSVP={onRSVP}
          onSave={onSave}
          className="compact"
        />
      ))}
    </div>
  );
};

export default RecommendationGrid;
