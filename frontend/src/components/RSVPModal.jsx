import { useState } from 'react';
// import { motion } from 'framer-motion';
import { X, Users, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const RSVPModal = ({ event, onClose, onConfirm }) => {
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState('confirmed');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">RSVP to Event</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Preview */}
        <div className="p-4 bg-blue-50">
          <h4 className="font-semibold text-gray-900">{event.title}</h4>
          <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(event.date), 'MMM d, h:mm a')}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location.venue}
            </span>
          </div>
        </div>

        {/* RSVP Options */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['confirmed', 'maybe', 'waitlist'].map((option) => (
                <button
                  key={option}
                  onClick={() => setStatus(option)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                    status === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-semibold hover:bg-gray-50"
              >
                -
              </button>
              <span className="flex-1 text-center text-lg font-semibold">
                {guests} {guests === 1 ? 'Guest' : 'Guests'}
              </span>
              <button
                onClick={() => setGuests(Math.min(5, guests + 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-semibold hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Available seats:</span>
              <span className="font-semibold text-gray-900">
                {event.capacity - (event.attendees?.length || 0)} / {event.capacity}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm({ guests, status })}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Confirm RSVP
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RSVPModal;