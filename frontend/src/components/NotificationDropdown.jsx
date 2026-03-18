// import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, AlertCircle, Heart, CheckCircle } from 'lucide-react';

const NotificationDropdown = ({ notifications,onMarkRead }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'event_update': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'seat_alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'recommendation': return <Heart className="w-5 h-5 text-purple-500" />;
      case 'rsvp_status': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-16 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-hidden z-20"
    >
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>

      <div className="overflow-y-auto max-h-80">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => onMarkRead(notification._id)}
            >
              <div className="flex space-x-3">
                <div className="shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t text-center">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Mark all as read
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;