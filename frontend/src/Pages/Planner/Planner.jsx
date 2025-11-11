import React, { useState } from "react";
import "./Planner.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const Planner = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Bali Adventure",
      category: "travel",
      status: "upcoming",
      startDate: "2024-08-15",
      endDate: "2024-08-25",
      location: "Bali, Indonesia",
      notes: "Surfing lessons, temple visits, and beach hopping"
    },
    {
      id: 2,
      name: "Learn Scuba Diving",
      category: "fitness",
      status: "in-progress",
      startDate: "2024-07-01",
      endDate: "2024-07-10",
      location: "Great Barrier Reef",
      notes: "PADI certification course"
    },
    {
      id: 3,
      name: "Japanese Cooking Class",
      category: "skills",
      status: "completed",
      startDate: "2024-06-10",
      endDate: "2024-06-12",
      location: "Tokyo, Japan",
      notes: "Learn authentic sushi and ramen making"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    search: ""
  });

  const [newPlan, setNewPlan] = useState({
    name: "",
    category: "travel",
    status: "upcoming",
    startDate: "",
    endDate: "",
    location: "",
    notes: ""
  });

  // Categories data
  const categories = [
    { id: "travel", name: "Travel", icon: "✈️", color: "#3B82F6" },
    { id: "skills", name: "Skills", icon: "🎯", color: "#8B5CF6" },
    { id: "fitness", name: "Fitness", icon: "💪", color: "#10B981" },
    { id: "creative", name: "Creative", icon: "🎨", color: "#F59E0B" },
    { id: "culture", name: "Culture", icon: "🏛️", color: "#EF4444" }
  ];

  // Status options
  const statusOptions = [
    { id: "upcoming", name: "Upcoming", color: "#8B5CF6" },
    { id: "in-progress", name: "In Progress", color: "#F59E0B" },
    { id: "completed", name: "Completed", color: "#10B981" }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new plan
  const handleAddPlan = (e) => {
    e.preventDefault();
    const plan = {
      ...newPlan,
      id: Date.now()
    };
    setPlans(prev => [plan, ...prev]);
    setNewPlan({
      name: "",
      category: "travel",
      status: "upcoming",
      startDate: "",
      endDate: "",
      location: "",
      notes: ""
    });
    setShowAddForm(false);
  };

  // Update plan status
  const updatePlanStatus = (planId, newStatus) => {
    setPlans(prev => prev.map(plan =>
      plan.id === planId ? { ...plan, status: newStatus } : plan
    ));
  };

  // Delete plan
  const deletePlan = (planId) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  // Bulk actions
  const bulkMarkCompleted = () => {
    setPlans(prev => prev.map(plan =>
      plan.status === "upcoming" ? { ...plan, status: "completed" } : plan
    ));
  };

  // Filter plans
  const filteredPlans = plans.filter(plan => {
    const matchesStatus = filters.status === "all" || plan.status === filters.status;
    const matchesCategory = filters.category === "all" || plan.category === filters.category;
    const matchesSearch = plan.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         plan.location.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Get category icon and color
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  // Get status info
  const getStatusInfo = (statusId) => {
    return statusOptions.find(status => status.id === statusId) || statusOptions[0];
  };

  // Calendar view - simple month view for demonstration
  const CalendarView = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <h3>{currentMonth}</h3>
          <div className="calendar-legend">
            {statusOptions.map(status => (
              <div key={status.id} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: status.color }}></span>
                {status.name}
              </div>
            ))}
          </div>
        </div>
        <div className="calendar-grid">
          {/* Simplified calendar grid - in real app, you'd use a library like react-calendar */}
          {filteredPlans.map(plan => (
            <div key={plan.id} className="calendar-event" style={{ borderLeftColor: getStatusInfo(plan.status).color }}>
              <span className="event-date">{new Date(plan.startDate).getDate()}</span>
              <span className="event-name">{plan.name}</span>
              <span className="event-category">{getCategoryInfo(plan.category).icon}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Timeline view
  const TimelineView = () => {
    return (
      <div className="timeline-view">
        {filteredPlans.map(plan => (
          <div key={plan.id} className="timeline-item">
            <div className="timeline-marker" style={{ backgroundColor: getStatusInfo(plan.status).color }}>
              {getCategoryInfo(plan.category).icon}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{plan.name}</h4>
                <span className="timeline-date">
                  {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="timeline-location">📍 {plan.location}</p>
              <p className="timeline-notes">{plan.notes}</p>
              <div className="timeline-actions">
                <button 
                  className="btn-status"
                  onClick={() => updatePlanStatus(plan.id, 
                    plan.status === "completed" ? "upcoming" : 
                    plan.status === "upcoming" ? "in-progress" : "completed"
                  )}
                >
                  Mark as {plan.status === "completed" ? "Upcoming" : 
                          plan.status === "upcoming" ? "In Progress" : "Completed"}
                </button>
                <button className="btn-delete" onClick={() => deletePlan(plan.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="planner-page">
      <Navbar />
      
      {/* Page Header */}
      <header className="planner-header">
        <h1>Trip Planner</h1>
        <p className="subtitle">Organize and schedule your bucket list adventures</p>
      </header>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="btn-primary add-plan-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Plan
        </button>
        
        <div className="bulk-actions">
          <button className="btn-secondary" onClick={bulkMarkCompleted}>
            Mark All Upcoming as Completed
          </button>
          <button className="btn-secondary">
            Export to PDF
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <span>🔍</span>
        </div>
        
        <div className="filter-controls">
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          
          <select 
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Plan Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="add-plan-form">
            <h2>Add New Plan</h2>
            <form onSubmit={handleAddPlan}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Trip / Experience Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPlan.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={newPlan.category} onChange={handleInputChange}>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={newPlan.status} onChange={handleInputChange}>
                    {statusOptions.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newPlan.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newPlan.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newPlan.location}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Notes / Description</label>
                <textarea
                  name="notes"
                  value={newPlan.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your adventure..."
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar/Timeline View */}
      <div className="views-section">
        <div className="view-toggle">
          <button className="view-btn active">Timeline View</button>
          <button className="view-btn">Calendar View</button>
        </div>
        
        <div className="view-content">
          <TimelineView />
          {/* <CalendarView /> - Uncomment when implementing full calendar */}
        </div>
      </div>

      {/* Planned Experiences List */}
      <section className="plans-section">
        <h2>Planned Experiences ({filteredPlans.length})</h2>
        <div className="plans-grid">
          {filteredPlans.map(plan => (
            <div key={plan.id} className="plan-card" style={{ borderTopColor: getStatusInfo(plan.status).color }}>
              <div className="card-header">
                <div className="card-title">
                  <span className="category-icon">{getCategoryInfo(plan.category).icon}</span>
                  <h3>{plan.name}</h3>
                </div>
                <span className="status-badge" style={{ backgroundColor: getStatusInfo(plan.status).color }}>
                  {getStatusInfo(plan.status).name}
                </span>
              </div>
              
              <div className="card-details">
                <p className="date-range">
                  📅 {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </p>
                {plan.location && <p className="location">📍 {plan.location}</p>}
                <p className="notes-preview">{plan.notes}</p>
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn-status"
                  onClick={() => updatePlanStatus(plan.id, 
                    plan.status === "completed" ? "upcoming" : 
                    plan.status === "upcoming" ? "in-progress" : "completed"
                  )}
                >
                  {plan.status === "completed" ? "↶ Reopen" : 
                   plan.status === "upcoming" ? "Start Progress" : "✓ Complete"}
                </button>
                <button className="btn-delete" onClick={() => deletePlan(plan.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Planner;