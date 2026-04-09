import { useState } from 'react';
import { X, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const RSVPModal = ({ event, onClose, onConfirm }) => {
  const [guests, setGuests] = useState(0); // number of guests excluding self
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (event.participationType === 'team' && !teamName.trim()) {
      toast.error('Team name is required');
      return;
    }

    if (event.participationType === 'both' && guests > 0 && !teamName.trim()) {
      toast.error('Please enter a team name for your group');
      return;
    }

    setLoading(true);

    if (event.paymentStatus === 'paid') {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            eventId: event._id,
            guests,
            teamName
          })
        });
        
        const data = await response.json();
        
        if (data.useFormData && data.formData) {
          // eSewa requires a traditional form submission
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.action;
          
          Object.keys(data.formData).forEach(key => {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = data.formData[key];
            form.appendChild(hiddenField);
          });
          
          document.body.appendChild(form);
          form.submit();
        } else if (data.url) { // Fallback if switched back to stripe
          window.location.href = data.url; 
        } else {
          toast.error('Failed to initiate checkout');
          setLoading(false);
        }
      } catch (error) {
        toast.error('Payment error');
        setLoading(false);
      }
    } else {
      // Pass data to parent logic for free event RSVP
      onConfirm({ guests, status: 'confirmed', teamName });
      setLoading(false);
    }
  };

  if (!event) return null;

  const totalTickets = 1 + guests;
  const totalPrice = (event.price || 0) * totalTickets;

  return (
    <div className="rsvp-modal-overlay" onClick={onClose}>
      <div 
        className="rsvp-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rsvp-header">
          <h3>RSVP to {event.title}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="rsvp-body">
          <div className="rsvp-event-summary">
            <div className="summary-item">
              <Calendar size={16} /> 
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="summary-item">
              <MapPin size={16} />
              <span>{event.location?.venue || 'Virtual Online'}</span>
            </div>
            {event.capacity && (
              <div className="summary-item text-green">
                <Users size={16} />
                <span>{event.capacity - (event.attendees?.length || 0)} seats left</span>
              </div>
            )}
            
            <div className="summary-item text-blue">
              <strong>Type: </strong> <span>{event.eventType === 'online' ? 'Online Event' : 'Onsite Event'}</span>
            </div>
          </div>

          {(event.participationType === 'team' || event.participationType === 'both') && (
            <div className="guest-selector" style={{ marginBottom: '1rem' }}>
              <label>Team Name {event.participationType === 'both' && guests === 0 ? '(Optional for Individuals)' : '*'}</label>
              <input 
                type="text" 
                placeholder="Enter your team name" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>
          )}

          <div className="guest-selector">
            <label>Attending +1 guest?</label>
            <p className="helper-text">Add extra members for your team/group (Max limit: {event.teamSizeLimit || 'No limit'})</p>
            <div className="guest-controls">
              <button 
                onClick={() => setGuests(Math.max(0, guests - 1))}
                className="guest-btn"
                disabled={guests <= 0}
              >
                -
              </button>
              <span className="guest-count">{guests}</span>
              <button 
                onClick={() => setGuests(guests + 1)}
                className="guest-btn"
                disabled={event.teamSizeLimit && guests >= event.teamSizeLimit - 1} // minus 1 because 1 is the main user
              >
                +
              </button>
            </div>
          </div>
          
          {event.paymentStatus === 'paid' && (
            <div className="price-summary" style={{ marginTop: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Base Price:</span>
                <span>NPR {event.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total ({totalTickets} ticket {totalTickets > 1 ? 's' : ''}):</span>
                <span>NPR {totalPrice}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rsvp-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="btn-confirm"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? 'Processing...' : event.paymentStatus === 'paid' ? `Pay NPR ${totalPrice}` : 'Confirm RSVP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RSVPModal;