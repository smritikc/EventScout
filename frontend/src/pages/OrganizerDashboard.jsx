import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import OrgSidebar from '../components/organizer/OrgSidebar';
import OrgStats from '../components/organizer/OrgStats';
import OrgEventTable from '../components/organizer/OrgEventTable';
import CreateEventModal from '../components/organizer/CreateEventModal';
import '../styles/organizer.css';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    activeEvents: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, [user?.id]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/events?organizer=${user?.id}`);
      const filtered = response.data.events.filter(e => e.organizer?._id === user?.id || e.organizer === user?.id);
      setMyEvents(filtered);
      
      const totalAtt = filtered.reduce((acc, curr) => acc + (curr.attendees?.length || 0), 0);
      setStats({
        totalEvents: filtered.length,
        totalAttendees: totalAtt,
        activeEvents: filtered.filter(e => new Date(e.date) > new Date()).length
      });
    } catch {
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organizer-layout">
      <OrgSidebar activeTab="events" user={user} />

      <main className="organizer-main">
        <header className="org-header">
          <div className="header-left">
            <h1>Events Manager</h1>
            <p>Welcome back, manage your hosted experiences here.</p>
          </div>
          <button className="btn-create" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Create New Event
          </button>
        </header>

        <OrgStats stats={stats} />

        <section className="events-list-section">
          <h2>Your Events</h2>
          <OrgEventTable events={myEvents} loading={loading} />
        </section>

        <CreateEventModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onEventCreated={fetchMyEvents} 
        />
      </main>
    </div>
  );
};

export default OrganizerDashboard;
