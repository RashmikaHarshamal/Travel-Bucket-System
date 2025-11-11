import React, { useState } from "react";
import "./BucketList.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const BucketList = () => {
  const [bucketList, setBucketList] = useState([
    { id: 1, name: "Visit Japan", status: "completed", category: "travel", date: "2023-05-15", priority: "high", notes: "Visit Tokyo, Kyoto, and Osaka" },
    { id: 2, name: "Learn Surfing", status: "in-progress", category: "skills", date: "2023-08-20", priority: "medium", notes: "Take lessons in Hawaii" },
    { id: 3, name: "See Northern Lights", status: "upcoming", category: "travel", date: "2024-01-10", priority: "high", notes: "Trip to Norway planned" },
    { id: 4, name: "Run a Marathon", status: "not-started", category: "fitness", date: "", priority: "medium", notes: "Train for 6 months" },
    { id: 5, name: "Write a Book", status: "not-started", category: "creative", date: "", priority: "low", notes: "Science fiction novel" },
    { id: 6, name: "Learn Italian", status: "in-progress", category: "skills", date: "2024-02-15", priority: "medium", notes: "Using language app daily" },
    { id: 7, name: "Visit Italy", status: "upcoming", category: "travel", date: "2024-06-15", priority: "high", notes: "Rome, Florence, Venice" },
  ]);

  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    date: "all",
    search: ""
  });

  const [sortBy, setSortBy] = useState("name");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newExperience, setNewExperience] = useState({
    name: "",
    category: "travel",
    status: "not-started",
    date: "",
    priority: "medium",
    notes: ""
  });

  // Filter and sort bucket list
  const filteredBucketList = bucketList
    .filter(item => {
      return (
        (filters.status === "all" || item.status === filters.status) &&
        (filters.category === "all" || item.category === filters.category) &&
        (filters.search === "" || item.name.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.date === "all" || 
          (filters.date === "upcoming" && item.date && new Date(item.date) > new Date()) ||
          (filters.date === "past" && item.date && new Date(item.date) <= new Date()))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(a.date || 0) - new Date(b.date || 0);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "status":
          const statusOrder = { completed: 4, "in-progress": 3, upcoming: 2, "not-started": 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        default:
          return 0;
      }
    });

  // Statistics
  const stats = {
    total: bucketList.length,
    completed: bucketList.filter(item => item.status === "completed").length,
    inProgress: bucketList.filter(item => item.status === "in-progress").length,
    upcoming: bucketList.filter(item => item.status === "upcoming").length,
    notStarted: bucketList.filter(item => item.status === "not-started").length,
    categories: bucketList.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {})
  };

  // Category progress
  const categoryProgress = Object.keys(stats.categories).map(category => {
    const categoryItems = bucketList.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.status === "completed").length;
    return {
      category,
      total: categoryItems.length,
      completed,
      percentage: Math.round((completed / categoryItems.length) * 100)
    };
  });

  // Action functions
  const markComplete = (id) => {
    setBucketList(bucketList.map(item => 
      item.id === id ? { ...item, status: "completed" } : item
    ));
  };

  const updateStatus = (id, newStatus) => {
    setBucketList(bucketList.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const deleteItem = (id) => {
    setBucketList(bucketList.filter(item => item.id !== id));
  };

  const addNewExperience = () => {
    if (!newExperience.name.trim()) return;
    
    const newItem = {
      id: Math.max(...bucketList.map(item => item.id)) + 1,
      ...newExperience
    };
    
    setBucketList([...bucketList, newItem]);
    setNewExperience({
      name: "",
      category: "travel",
      status: "not-started",
      date: "",
      priority: "medium",
      notes: ""
    });
    setShowAddForm(false);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const bulkMarkComplete = () => {
    setBucketList(bucketList.map(item => 
      selectedItems.includes(item.id) ? { ...item, status: "completed" } : item
    ));
    setSelectedItems([]);
  };

  const bulkDelete = () => {
    setBucketList(bucketList.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "travel": return "✈️";
      case "skills": return "🎓";
      case "fitness": return "💪";
      case "creative": return "🎨";
      default: return "⭐";
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="bucketlist-page">
        {/* Header Section */}
        <div className="bucketlist-header">
          <div className="header-main">
            <h1>My Bucket List</h1>
            <button 
              className="btn-primary btn-large"
              onClick={() => setShowAddForm(true)}
            >
              + Add New Experience
            </button>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item completed">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item in-progress">
              <span className="stat-number">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-item upcoming">
              <span className="stat-number">{stats.upcoming}</span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Filters & Sorting Section */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="upcoming">Upcoming</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                <option value="travel">Travel</option>
                <option value="skills">Skills</option>
                <option value="fitness">Fitness</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date:</label>
              <select 
                value={filters.date} 
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="search-group">
              <input 
                type="text" 
                placeholder="Search experiences..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedItems.length} items selected</span>
              <button className="btn-success" onClick={bulkMarkComplete}>
                Mark Complete
              </button>
              <button className="btn-danger" onClick={bulkDelete}>
                Delete
              </button>
              <button className="btn-outline" onClick={() => setSelectedItems([])}>
                Clear Selection
              </button>
            </div>
          )}
        </div>

        <div className="bucketlist-content">
          {/* Sidebar with Category Progress */}
          <div className="sidebar">
            <h3>Category Progress</h3>
            <div className="category-progress">
              {categoryProgress.map(progress => (
                <div key={progress.category} className="progress-item">
                  <div className="progress-header">
                    <span>{getCategoryIcon(progress.category)} {progress.category}</span>
                    <span>{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-percent">{progress.percentage}%</span>
                </div>
              ))}
            </div>

            {/* Mini Map Placeholder */}
            <div className="mini-map">
              <h3>Travel Map</h3>
              <div className="map-placeholder">
                <p>🌍 Map Preview</p>
                <p>{stats.categories.travel || 0} travel destinations</p>
              </div>
            </div>
          </div>

          {/* Main Bucket List Grid */}
          <div className="bucketlist-main">
            <div className="bucket-grid">
              {filteredBucketList.map(item => (
                <div 
                  key={item.id} 
                  className={`bucket-item ${item.status} ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelectItem(item.id)}
                >
                  <div className="item-header">
                    <div className="item-meta">
                      <span className="category-icon">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span className="priority">
                        {getPriorityIcon(item.priority)}
                      </span>
                    </div>
                    <div className="item-actions">
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality would go here
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="item-name">{item.name}</h3>
                  
                  {item.notes && (
                    <p className="item-notes">{item.notes}</p>
                  )}

                  <div className="item-details">
                    <span className={`status-badge ${item.status}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                    {item.date && (
                      <span className="item-date">
                        📅 {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {item.status !== "completed" && (
                    <div className="item-actions-main">
                      <select 
                        value={item.status} 
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="status-select"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      {item.status !== "completed" && (
                        <button 
                          className="btn-complete"
                          onClick={(e) => {
                            e.stopPropagation();
                            markComplete(item.id);
                          }}
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredBucketList.length === 0 && (
              <div className="empty-state">
                <p>No experiences match your current filters.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setFilters({ status: "all", category: "all", date: "all", search: "" })}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add New Experience Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Experience</h2>
              
              <div className="form-group">
                <label>Experience Name *</label>
                <input 
                  type="text" 
                  value={newExperience.name}
                  onChange={(e) => setNewExperience({...newExperience, name: e.target.value})}
                  placeholder="e.g., Visit Paris, Learn Guitar..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newExperience.category}
                    onChange={(e) => setNewExperience({...newExperience, category: e.target.value})}
                  >
                    <option value="travel">Travel</option>
                    <option value="skills">Skills</option>
                    <option value="fitness">Fitness</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={newExperience.status}
                    onChange={(e) => setNewExperience({...newExperience, status: e.target.value})}
                  >
                    <option value="not-started">Not Started</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={newExperience.date}
                    onChange={(e) => setNewExperience({...newExperience, date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={newExperience.priority}
                    onChange={(e) => setNewExperience({...newExperience, priority: e.target.value})}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  value={newExperience.notes}
                  onChange={(e) => setNewExperience({...newExperience, notes: e.target.value})}
                  placeholder="Any additional details..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-primary"
                  onClick={addNewExperience}
                  disabled={!newExperience.name.trim()}
                >
                  Add Experience
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Add Button for Mobile */}
        <button 
          className="btn-primary floating-add-btn"
          onClick={() => setShowAddForm(true)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BucketList;