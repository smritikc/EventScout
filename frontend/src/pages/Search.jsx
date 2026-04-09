import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, Calendar, X, SlidersHorizontal } from 'lucide-react';
import gsap from 'gsap';
import { searchEvents } from '../services/eventService';
import EventCard from '../components/EventCard';
import '../styles/search.css';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    priceRange: '',
    location: '',
    eventType: '',
    paymentStatus: ''
  });
  
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.from(searchRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    // Animate results when they appear
    if (results.length > 0) {
      gsap.from(resultsRef.current.children, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }
  }, [results]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Search icon animation
    gsap.to('.search-icon', {
      rotation: 360,
      duration: 0.5,
      ease: 'power2.out'
    });

    try {
      const events = await searchEvents(query, filters);
      setResults(events);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setFilters({
      category: '',
      date: '',
      priceRange: '',
      location: '',
      eventType: '',
      paymentStatus: ''
    });
  };

  const categories = [
    'Tech Meetups', 'Cultural', 'Music', 'Sports', 'Food', 'Workshops'
  ];

  const priceRanges = [
    'Free', '<500 NPR', '<2000 NPR', 'Any'
  ];

  return (
    <div className="search-page">
      <header className="search-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Search Events</h1>
      </header>

      <main className="search-main">
        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <SearchIcon className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search for events, categories, or locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button type="button" className="clear-btn" onClick={clearSearch}>
                  <X size={18} />
                </button>
              )}
            </div>

            <button 
              type="button" 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>

            <button type="submit" className="search-submit" disabled={!query.trim()}>
              Search
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel" ref={filterRef}>
              <h3>Filter Results</h3>
              
              <div className="filter-group">
                <label>Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                >
                  <option value="">Any Price</option>
                  {priceRanges.map(price => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Event Type</label>
                <select 
                  value={filters.eventType || ''}
                  onChange={(e) => setFilters({...filters, eventType: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="onsite">Onsite</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Payment</label>
                <select 
                  value={filters.paymentStatus || ''}
                  onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="filter-actions">
                <button className="apply-filters" onClick={handleSearch}>Apply Filters</button>
                <button className="clear-filters" onClick={() => setFilters({
                  category: '', date: '', priceRange: '', location: '', eventType: '', paymentStatus: ''
                })}>Clear</button>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="search-results" ref={resultsRef}>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching events...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="results-header">
                <h2>{results.length} events found</h2>
              </div>
              <div className="results-grid">
                {results.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </>
          ) : query && (
            <div className="no-results">
              <SearchIcon size={64} />
              <h3>No events found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="browse-btn" onClick={clearSearch}>
                Browse All Events
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;