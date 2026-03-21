import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/pref-quiz.css';

const categories = [
  { id: 'Tech Meetups', name: 'Tech Meetups', emoji: '💻' },
  { id: 'Cultural', name: 'Cultural', emoji: '🎭' },
  { id: 'Music', name: 'Music', emoji: '🎵' },
  { id: 'Sports', name: 'Sports', emoji: '⚽' },
  { id: 'Food', name: 'Food', emoji: '🍜' },
  { id: 'Workshops', name: 'Workshops', emoji: '🔧' }
];

const locations = [
  { id: 'Dhangadhi 10km', name: 'Dhangadhi', range: '10km' },
  { id: 'Kailali 50km', name: 'Kailali', range: '50km' },
  { id: 'Sudurpashchim', name: 'Sudurpashchim', range: 'Region' },
  { id: 'All Nepal', name: 'All Nepal', range: 'Nationwide' }
];

const frequencies = [
  { id: 'Weekly', name: 'Weekly', desc: 'Active explorer' },
  { id: 'Monthly', name: 'Monthly', desc: 'Occasional outings' },
  { id: 'Big Events Only', name: 'Big Events Only', desc: 'Festivals & concerts' }
];

const budgets = [
  { id: 'Free', name: 'Free', desc: '0 NPR' },
  { id: '<500 NPR', name: '<500 NPR', desc: 'Budget friendly' },
  { id: '<2000 NPR', name: '<2000 NPR', desc: 'Standard events' },
  { id: 'Any', name: 'Any', desc: 'No limits' }
];

const PrefQuiz = () => {
  const navigate = useNavigate();
  const { user, updatePreferences } = useAuth();
  
  const [preferences, setPreferences] = useState({
    categories: [],
    locationRadius: 'Dhangadhi 10km',
    frequency: 'Weekly',
    budgetRange: 'Any'
  });

  // Pre-fill if user already has preferences but wants to edit
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...user.preferences
      }));
    }
  }, [user]);

  const toggleCategory = (id) => {
    setPreferences(prev => {
      const isSelected = prev.categories.includes(id);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== id) };
      } else {
        return { ...prev, categories: [...prev.categories, id] };
      }
    });
  };

  const handleSave = async () => {
    if (preferences.categories.length === 0) {
      toast.error('Please select at least one category to get started!');
      return;
    }
    try {
      if (updatePreferences) {
        await updatePreferences(preferences);
      }
      toast.success('Preferences saved safely! 🚀');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save preferences.');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="pref-quiz-page">
      <div className="pref-quiz-container">
        {/* Header */}
        <div className="pref-quiz-header">
          <h1 className="pref-quiz-title">
            🎯 Help us find your perfect events, {firstName}!
          </h1>
          <p className="pref-quiz-subtitle">
            Personalize your EventScout experience in 30 seconds.
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="pref-quiz-content">
          
          <section className="pref-section">
            <div className="pref-section-header">
              <h2>1. What kind of events do you love?</h2>
              <span>Select all that apply</span>
            </div>
            <div className="pref-grid categories-grid">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`pref-category-btn ${
                    preferences.categories.includes(cat.id) ? 'selected' : ''
                  }`}
                >
                  <span className="category-emoji">{cat.emoji}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="pref-section">
            <div className="pref-section-header">
              <h2>2. How far are you willing to travel?</h2>
              <span>Location & Radius</span>
            </div>
            <div className="pref-grid locations-grid">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setPreferences({ ...preferences, locationRadius: loc.id })}
                  className={`pref-option-btn ${
                    preferences.locationRadius === loc.id ? 'selected' : ''
                  }`}
                >
                  <MapPin className="pref-icon" size={20} />
                  <div className="pref-option-info">
                    <span className="pref-name">{loc.name}</span>
                    <span className="pref-desc">{loc.range}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="pref-section">
            <div className="pref-section-header">
              <h2>3. How often do you want to go out?</h2>
              <span>Frequency</span>
            </div>
            <div className="pref-grid freq-grid">
              {frequencies.map(freq => (
                <button
                  key={freq.id}
                  onClick={() => setPreferences({ ...preferences, frequency: freq.id })}
                  className={`pref-option-btn ${
                    preferences.frequency === freq.id ? 'selected' : ''
                  }`}
                >
                  <Calendar className="pref-icon" size={20} />
                  <div className="pref-option-info">
                    <span className="pref-name">{freq.name}</span>
                    <span className="pref-desc">{freq.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="pref-section">
            <div className="pref-section-header">
              <h2>4. What's your typical budget?</h2>
              <span>Per event</span>
            </div>
            <div className="pref-grid budget-grid">
              {budgets.map(budget => (
                <button
                  key={budget.id}
                  onClick={() => setPreferences({ ...preferences, budgetRange: budget.id })}
                  className={`pref-option-btn ${
                    preferences.budgetRange === budget.id ? 'selected' : ''
                  }`}
                >
                  <DollarSign className="pref-icon" size={20} />
                  <div className="pref-option-info">
                    <span className="pref-name">{budget.name}</span>
                    <span className="pref-desc">{budget.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Sticky Actions Footer */}
        <div className="pref-quiz-footer">
          <button onClick={handleSkip} className="btn-skip">
            Skip for Now
          </button>
          <button onClick={handleSave} className="btn-save pulse-action">
            Save & Continue
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrefQuiz;