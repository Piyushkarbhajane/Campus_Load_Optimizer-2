import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Calendar, Clock, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { studentService } from '../../../services/studentService';
import { dateUtils } from '../../../utils/dateUtils';

const PersonalEventsView = () => {
  const { user } = useAuth();
  const [personalEvents, setPersonalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, today

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: 1,
    type: 'personal',
    description: '',
    location: '',
    reminder: true
  });

  useEffect(() => {
    loadPersonalEvents();
  }, [user]);

  const loadPersonalEvents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getDashboardData();
      
      // Get personal events and add some sample ones
      const events = data.personalEvents || [];
      const enhancedEvents = events.map(event => ({
        ...event,
        description: event.description || '',
        location: event.location || '',
        reminder: event.reminder !== false
      }));
      
      setPersonalEvents(enhancedEvents);
    } catch (error) {
      console.error('Error loading personal events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    const today = now.toDateString();
    
    switch (filter) {
      case 'upcoming':
        return personalEvents.filter(event => new Date(event.date) >= now);
      case 'past':
        return personalEvents.filter(event => new Date(event.date) < now);
      case 'today':
        return personalEvents.filter(event => new Date(event.date).toDateString() === today);
      default:
        return personalEvents;
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    
    const event = {
      id: Date.now(),
      ...newEvent,
      createdAt: new Date().toISOString()
    };
    
    setPersonalEvents(prev => [...prev, event].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewEvent({
      title: '',
      date: '',
      time: '',
      duration: 1,
      type: 'personal',
      description: '',
      location: '',
      reminder: true
    });
    setShowAddForm(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent.title || !editingEvent.date) return;
    
    setPersonalEvents(prev => 
      prev.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ).sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setPersonalEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      study: 'bg-purple-100 text-purple-800 border-purple-200',
      interview: 'bg-blue-100 text-blue-800 border-blue-200',
      personal: 'bg-green-100 text-green-800 border-green-200',
      work: 'bg-orange-100 text-orange-800 border-orange-200',
      health: 'bg-red-100 text-red-800 border-red-200',
      social: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[type] || colors.personal;
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'study': return '📚';
      case 'interview': return '💼';
      case 'work': return '🏢';
      case 'health': return '🏥';
      case 'social': return '👥';
      default: return '📅';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredEvents = getFilteredEvents();
  const upcomingCount = personalEvents.filter(e => new Date(e.date) >= new Date()).length;
  const todayCount = personalEvents.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <User className="w-8 h-8 mr-3 text-green-500" />
              Personal Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal schedule and events outside of academics
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </motion.div>

      {/* Stats and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{personalEvents.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{upcomingCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{todayCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: personalEvents.length },
              { key: 'today', label: 'Today', count: todayCount },
              { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
              { key: 'past', label: 'Past', count: personalEvents.length - upcomingCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add Event Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Event</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter event title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type
              </label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="personal">Personal</option>
                <option value="study">Study</option>
                <option value="interview">Interview</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={newEvent.duration}
                onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Event location"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Event description (optional)"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEvent}
              disabled={!newEvent.title || !newEvent.date}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
          >
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'You haven\'t added any personal events yet.'
                : `No ${filter} events to display.`
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Your First Event
            </button>
          </motion.div>
        ) : (
          filteredEvents.map((event, index) => {
            const isEditing = editingEvent?.id === event.id;
            const isPast = new Date(event.date) < new Date();
            const isToday = new Date(event.date).toDateString() === new Date().toDateString();
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                  isPast ? 'opacity-75' : ''
                } ${isToday ? 'ring-2 ring-green-500' : ''}`}
              >
                {isEditing ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent(prev => ({ ...prev, title: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <select
                        value={editingEvent.type}
                        onChange={(e) => setEditingEvent(prev => ({ ...prev, type: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="personal">Personal</option>
                        <option value="study">Study</option>
                        <option value="interview">Interview</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="social">Social</option>
                      </select>
                      <input
                        type="date"
                        value={editingEvent.date}
                        onChange={(e) => setEditingEvent(prev => ({ ...prev, date: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="time"
                        value={editingEvent.time}
                        onChange={(e) => setEditingEvent(prev => ({ ...prev, time: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingEvent(null)}
                        className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateEvent}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          {isToday && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{dateUtils.formatDate(event.date, 'long')}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          <span>{event.duration}h duration</span>
                        </div>
                        
                        {event.location && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            📍 {event.location}
                          </p>
                        )}
                        
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PersonalEventsView;