import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import gsap from 'gsap';
import { getUserRSVPs } from '../services/eventService';
import '../styles/calendar.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month'); // month, week, day
  
  const calendarRef = useRef(null);
  const eventsRef = useRef(null);

  

  useEffect(() => {
    // Animate events when they load or date changes
    if (events.length > 0) {
      gsap.from(eventsRef.current.children, {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [events, selectedDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const userEvents = await getUserRSVPs();
      setEvents(userEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.date), date)
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    
    // Animation
    gsap.from(calendarRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    
    // Animation
    gsap.from(calendarRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle size={16} className="status-confirmed" />;
      case 'maybe': return <AlertCircle size={16} className="status-maybe" />;
      case 'cancelled': return <XCircle size={16} className="status-cancelled" />;
      default: return null;
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>My Calendar</h1>
        <div className="view-toggle">
          <button 
            className={view === 'month' ? 'active' : ''} 
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button 
            className={view === 'week' ? 'active' : ''} 
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button 
            className={view === 'day' ? 'active' : ''} 
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </header>

      <main className="calendar-main">
        <div className="calendar-container" ref={calendarRef}>
          {/* Calendar Header */}
          <div className="calendar-nav">
            <button onClick={handlePrevMonth} className="nav-btn">
              <ChevronLeft size={20} />
            </button>
            <h2>{format(currentDate, 'MMMM yyyy')}</h2>
            <button onClick={handleNextMonth} className="nav-btn">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {getDaysInMonth().map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} 
                    ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="day-number">{format(day, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div key={i} className="day-event-indicator">
                          {getStatusIcon(event.status)}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="more-indicator">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="selected-date-events" ref={eventsRef}>
          <div className="events-header">
            <CalendarIcon size={20} />
            <h3>Events on {format(selectedDate, 'MMMM d, yyyy')}</h3>
          </div>

          {loading ? (
            <div className="loading-events">
              <div className="spinner-small"></div>
              <p>Loading events...</p>
            </div>
          ) : selectedDateEvents.length > 0 ? (
            <div className="events-list">
              {selectedDateEvents.map(event => (
                <div 
                  key={event._id} 
                  className="event-item"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="event-time">
                    <Clock size={16} />
                    <span>{format(parseISO(event.date), 'h:mm a')}</span>
                  </div>
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p className="event-location">
                      <MapPin size={14} />
                      {event.location?.venue}
                    </p>
                    <div className="event-meta">
                      <span className="event-status">
                        {getStatusIcon(event.status)}
                        {event.status}
                      </span>
                      <span className="event-attendees">
                        <Users size={14} />
                        {event.attendees?.length || 0} attending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <CalendarIcon size={48} />
              <p>No events scheduled for this day</p>
              <button 
                className="browse-btn"
                onClick={() => navigate('/search')}
              >
                Find Events
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calendar;