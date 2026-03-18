import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, MapPin, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/pref-quiz.css'; // You'll need to create this CSS file

const categories = [
  { id: 'tech', name: 'Tech Meetups', emoji: '💻' },
  { id: 'cultural', name: 'Cultural', emoji: '🎭' },
  { id: 'music', name: 'Music', emoji: '🎵' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'food', name: 'Food', emoji: '🍜' },
  { id: 'workshops', name: 'Workshops', emoji: '🔧' }
];

const locations = [
  { id: 'dhangadhi', name: 'Dhangadhi 10km', range: '10km' },
  { id: 'kailali', name: 'Kailali 50km', range: '50km' },
  { id: 'sudurpashchim', name: 'Sudurpashchim', range: '100km' },
  { id: 'nepal', name: 'All Nepal', range: 'nationwide' }
];

const frequencies = [
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'big', name: 'Big Events Only' }
];

const budgets = [
  { id: 'free', name: 'Free', range: '0' },
  { id: 'low', name: '<500 NPR', range: '1-500' },
  { id: 'medium', name: '<2000 NPR', range: '501-2000' },
  { id: 'any', name: 'Any', range: 'any' }
];

const PrefQuiz = () => {
  const navigate = useNavigate();
  const { updatePreferences } = useAuth();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    categories: [],
    location: 'dhangadhi',
    frequency: 'weekly',
    budget: 'any'
  });

  const steps = [
    {
      title: "What events do you love?",
      subtitle: "Select all that interest you",
      component: (
        <div className="pref-grid">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                const newCats = preferences.categories.includes(cat.id)
                  ? preferences.categories.filter(c => c !== cat.id)
                  : [...preferences.categories, cat.id];
                setPreferences({ ...preferences, categories: newCats });
              }}
              className={`pref-category-btn ${
                preferences.categories.includes(cat.id) ? 'selected' : ''
              }`}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Where should we look?",
      subtitle: "Choose your preferred location",
      component: (
        <div className="pref-list">
          {locations.map(loc => (
            <button
              key={loc.id}
              onClick={() => setPreferences({ ...preferences, location: loc.id })}
              className={`pref-item ${
                preferences.location === loc.id ? 'selected' : ''
              }`}
            >
              <div className="pref-item-content">
                <MapPin className="pref-icon" />
                <span className="pref-name">{loc.name}</span>
              </div>
              <span className="pref-range">{loc.range}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "How often?",
      subtitle: "Tell us your event frequency preference",
      component: (
        <div className="pref-list">
          {frequencies.map(freq => (
            <button
              key={freq.id}
              onClick={() => setPreferences({ ...preferences, frequency: freq.id })}
              className={`pref-item ${
                preferences.frequency === freq.id ? 'selected' : ''
              }`}
            >
              <div className="pref-item-content">
                <Calendar className="pref-icon" />
                <span className="pref-name">{freq.name}</span>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "What's your budget?",
      subtitle: "Set your preferred price range",
      component: (
        <div className="pref-list">
          {budgets.map(budget => (
            <button
              key={budget.id}
              onClick={() => setPreferences({ ...preferences, budget: budget.id })}
              className={`pref-item ${
                preferences.budget === budget.id ? 'selected' : ''
              }`}
            >
              <div className="pref-item-content">
                <DollarSign className="pref-icon" />
                <span className="pref-name">{budget.name}</span>
              </div>
            </button>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step === 0 && preferences.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await updatePreferences(preferences);
      toast.success('Preferences saved!');
      navigate('/dashboard');
    } catch {
      // Removed unused error parameter
      toast.error('Failed to save preferences');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="pref-quiz-page">
      <div className="pref-quiz-container">
        {/* Header */}
        <div className="pref-quiz-header">
          <h1 className="pref-quiz-title">Help us find your perfect events!</h1>
          <p className="pref-quiz-step">Step {step + 1} of {steps.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="pref-progress">
          <div 
            className="pref-progress-bar"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="pref-quiz-content">
          <h2 className="pref-question">
            {steps[step].title}
          </h2>
          <p className="pref-subtitle">{steps[step].subtitle}</p>

          {steps[step].component}

          {/* Navigation */}
          <div className="pref-nav">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="pref-nav-btn back"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="pref-nav-btn next"
            >
              {step === steps.length - 1 ? 'Save Preferences' : 'Next'}
              {step < steps.length - 1 && <ChevronRight size={20} />}
            </button>
          </div>

          {step === 0 && (
            <button
              onClick={handleSkip}
              className="pref-skip-btn"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrefQuiz;