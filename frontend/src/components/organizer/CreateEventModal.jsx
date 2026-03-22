import { useState } from 'react';
import { X, Calendar, MapPin, Tag, DollarSign, Users, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech Meetups',
    date: '',
    time: '',
    location: {
      venue: '',
      city: ''
    },
    price: 0,
    priceCategory: 'Free',
    capacity: '',
    images: [''] // Default placeholder or empty
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/events`, formData);
      toast.success('Event created successfully! 🎉');
      onEventCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <header className="modal-header">
          <h2>Create New Event</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label><Tag size={16} /> Event Title</label>
              <input 
                type="text" name="title" placeholder="e.g. Design Systems Workshop" 
                required onChange={handleChange} 
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                name="description" rows="3" placeholder="Describe your event..." 
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label><Calendar size={16} /> Date</label>
              <input type="date" name="date" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> City</label>
              <input type="text" name="location.city" placeholder="e.g. Kathmandu" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Venue</label>
              <input type="text" name="location.venue" placeholder="e.g. ITC Garden" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" required onChange={handleChange} value={formData.category}>
                <option value="Tech Meetups">Tech Meetups</option>
                <option value="Cultural">Cultural</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Workshops">Workshops</option>
              </select>
            </div>

            <div className="form-group">
              <label><Users size={16} /> Capacity</label>
              <input type="number" name="capacity" placeholder="e.g. 50" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><DollarSign size={16} /> Price (NPR)</label>
              <input type="number" name="price" placeholder="0 for Free" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><ImageIcon size={16} /> Image URL</label>
              <input 
                type="text" name="images.0" placeholder="https://..." 
                onChange={(e) => setFormData({...formData, images: [e.target.value]})} 
              />
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Launch Event 🚀'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
