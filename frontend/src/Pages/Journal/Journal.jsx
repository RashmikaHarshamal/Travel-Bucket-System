import React, { useState } from "react";
import "./Journal.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const Journal = () => {
  const [entries, setEntries] = useState([
    { 
      id: 1, 
      title: "Trip to Japan", 
      date: "2023-05-15", 
      category: "Travel", 
      status: "Completed", 
      content: "Amazing cherry blossoms and sushi! The temples in Kyoto were breathtaking and the food was incredible everywhere we went.", 
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
      favorite: true,
      rating: 5
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  });
  const [sortBy, setSortBy] = useState("newest");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    category: "Travel",
    status: "Upcoming",
    content: "",
    image: "",
    rating: 3
  });

  // Categories with icons
  const categories = {
    "Travel": "🌍",
    "Skills": "⚡",
    "Fitness": "💪",
    "Creative": "🎨",
    "Food": "🍕",
    "Learning": "📚",
    "Personal": "🌟"
  };

  // Status options with colors
  const statusOptions = {
    "Completed": "completed",
    "In Progress": "in-progress",
    "Upcoming": "upcoming"
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save entry (both new and edit)
  const handleSaveEntry = (e) => {
    e.preventDefault();
    
    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...formData, id: editingEntry.id, favorite: editingEntry.favorite }
          : entry
      ));
    } else {
      // Add new entry
      const newEntry = {
        ...formData,
        id: Date.now(),
        favorite: false
      };
      setEntries(prev => [...prev, newEntry]);
    }
    
    resetForm();
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      date: new Date().toISOString().split('T')[0],
      category: "Travel",
      status: "Upcoming",
      content: "",
      image: "",
      rating: 3
    });
    setEditingEntry(null);
    setShowForm(false);
  };

  // Edit entry
  const handleEdit = (entry) => {
    setFormData(entry);
    setEditingEntry(entry);
    setShowForm(true);
  };

  // Delete entry
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  // Mark as completed
  const handleMarkCompleted = (id) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, status: "Completed" } : entry
    ));
  };

  // Toggle favorite
  const handleToggleFavorite = (id) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    ));
  };

  // Filter and sort entries
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           entry.content.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || entry.category === filters.category;
      const matchesStatus = !filters.status || entry.status === filters.status;
      const matchesDate = (!filters.dateFrom || entry.date >= filters.dateFrom) &&
                         (!filters.dateTo || entry.date <= filters.dateTo);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "rating":
          return b.rating - a.rating;
        case "favorite":
          return (b.favorite === a.favorite) ? 0 : b.favorite ? -1 : 1;
        default:
          return 0;
      }
    });

  // Export entries as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div>
      <Navbar />
      
      <div className="journal-page">
        {/* Page Header */}
        <header className="journal-header">
          <h1>My Travel Journal</h1>
          <p className="journal-subtitle">Capture your experiences and memories</p>
        </header>

        {/* Controls Section */}
        <div className="journal-controls">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add New Journal Entry
          </button>
          
          <div className="controls-right">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rating</option>
              <option value="favorite">Favorites First</option>
            </select>
            
            <button 
              className="btn-secondary"
              onClick={handleExport}
            >
              Export Journal
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title or notes..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select 
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              {Object.keys(statusOptions).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
            
            <input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
            
            {(filters.search || filters.category || filters.status || filters.dateFrom || filters.dateTo) && (
              <button 
                className="btn-clear"
                onClick={() => setFilters({ search: "", category: "", status: "", dateFrom: "", dateTo: "" })}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="form-overlay">
            <form className="journal-form" onSubmit={handleSaveEntry}>
              <h2>{editingEntry ? "Edit Journal Entry" : "Add New Journal Entry"}</h2>
              
              <div className="form-row">
                <input
                  type="text"
                  name="title"
                  placeholder="Title of experience"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  {Object.keys(categories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  {Object.keys(statusOptions).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <label>Rating: {formData.rating} ★</label>
                <input
                  type="range"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-row">
                <textarea
                  name="content"
                  placeholder="Notes / Description"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>
              
              <div className="form-row">
                <input
                  type="url"
                  name="image"
                  placeholder="Image URL (optional)"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Journal Entries List */}
        <div className="journal-entries">
          {filteredEntries.length === 0 ? (
            <div className="no-entries">
              <p>No journal entries found. {!filters.search && "Start by adding your first entry!"}</p>
              {filters.search && (
                <button 
                  className="btn-primary"
                  onClick={() => setFilters({ search: "", category: "", status: "", dateFrom: "", dateTo: "" })}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div key={entry.id} className={`journal-card ${entry.favorite ? 'favorite' : ''}`}>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{entry.title}</h3>
                    <button 
                      className={`favorite-btn ${entry.favorite ? 'active' : ''}`}
                      onClick={() => handleToggleFavorite(entry.id)}
                    >
                      {entry.favorite ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="card-meta">
                    <span className="date">{entry.date}</span>
                    <span className={`status-badge ${statusOptions[entry.status]}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="category-rating">
                    <span className="category">
                      {categories[entry.category]} {entry.category}
                    </span>
                    <span className="rating">
                      {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                    </span>
                  </div>
                  
                  <p className="notes-preview">
                    {entry.content.length > 150 ? `${entry.content.substring(0, 150)}...` : entry.content}
                  </p>
                  
                  {entry.image && (
                    <div className="image-thumbnail">
                      <img src={entry.image} alt={entry.title} />
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  
                  {entry.status !== "Completed" && (
                    <button 
                      className="btn-complete"
                      onClick={() => handleMarkCompleted(entry.id)}
                    >
                      Mark Completed
                    </button>
                  )}
                  
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;