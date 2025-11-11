import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const Dashboard = () => {
  const [bucketList, setBucketList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    categories: {}
  });
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Sample data with more items for better visualization
    const data = [
      { id: 1, name: "Visit Japan", status: "completed", date: "2023-05-15", category: "travel" },
      { id: 2, name: "Learn Surfing", status: "in-progress", date: "2023-08-20", category: "skills" },
      { id: 3, name: "See Northern Lights", status: "upcoming", date: "2024-01-10", category: "travel" },
      { id: 4, name: "Run Marathon", status: "completed", date: "2023-10-05", category: "fitness" },
      { id: 5, name: "Write Novel", status: "in-progress", date: "2023-11-15", category: "creative" },
      { id: 6, name: "Learn Guitar", status: "upcoming", date: "2024-03-01", category: "skills" },
      { id: 7, name: "Visit Italy", status: "upcoming", date: "2024-06-15", category: "travel" },
    ];
    setBucketList(data);
    calculateStats(data);
  }, []);

  const calculateStats = (data) => {
    const categories = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    setStats({
      total: data.length,
      completed: data.filter(i => i.status === "completed").length,
      inProgress: data.filter(i => i.status === "in-progress").length,
      upcoming: data.filter(i => i.status === "upcoming").length,
      categories: categories
    });
  };

  const getStatusIcon = (status) => {
    switch(status){
      case "completed": return "✅";
      case "in-progress": return "🔄";
      case "upcoming": return "📅";
      default: return "⏳";
    }
  };

  const getCategoryIcon = (category) => {
    switch(category){
      case "travel": return "✈️";
      case "skills": return "🎓";
      case "fitness": return "💪";
      case "creative": return "🎨";
      default: return "⭐";
    }
  };

  const getProgressPercentage = () => {
    return stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  };

  const getRecentActivities = () => {
    return bucketList
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const getUpcomingItems = () => {
    return bucketList
      .filter(item => item.status === "upcoming")
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const markAsComplete = (id) => {
    const updatedList = bucketList.map(item => 
      item.id === id ? { ...item, status: "completed" } : item
    );
    setBucketList(updatedList);
    calculateStats(updatedList);
  };

  const filteredBucketList = selectedCategory === "all" 
    ? bucketList 
    : bucketList.filter(item => item.category === selectedCategory);

  // Sample inspiration data
  const inspirationItems = [
    { id: 1, title: "Top 10 European Destinations", category: "travel" },
    { id: 2, title: "Learn a New Language in 30 Days", category: "skills" },
    { id: 3, title: "Mountain Hiking Adventures", category: "fitness" },
    { id: 4, title: "Creative Writing Prompts", category: "creative" },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-page">
        <h1>Dashboard</h1>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="btn-primary">Add New Experience</button>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">All Categories</option>
            <option value="travel">Travel</option>
            <option value="skills">Skills</option>
            <option value="fitness">Fitness</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Key Stats Section */}
        <div className="stats-section">
          <h2>Overview</h2>
          <div className="stats-cards">
            <div className="stat-card total">
              <h3>Total Experiences</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
            <div className="stat-card completed">
              <h3>Completed</h3>
              <p className="stat-number">{stats.completed}</p>
            </div>
            <div className="stat-card in-progress">
              <h3>In Progress</h3>
              <p className="stat-number">{stats.inProgress}</p>
            </div>
            <div className="stat-card upcoming">
              <h3>Upcoming</h3>
              <p className="stat-number">{stats.upcoming}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="categories-breakdown">
            <h3>Categories</h3>
            <div className="category-tags">
              {Object.entries(stats.categories).map(([category, count]) => (
                <span key={category} className="category-tag">
                  {getCategoryIcon(category)} {category}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="progress-section">
          <div className="progress-chart">
            <h3>Progress Overview</h3>
            <div className="progress-container">
              <div className="radial-progress">
                <div className="progress-circle">
                  <span className="progress-percent">{getProgressPercentage()}%</span>
                </div>
              </div>
              <div className="progress-stats">
                <div className="progress-item completed">
                  <span className="progress-dot"></span>
                  Completed: {stats.completed}
                </div>
                <div className="progress-item in-progress">
                  <span className="progress-dot"></span>
                  In Progress: {stats.inProgress}
                </div>
                <div className="progress-item upcoming">
                  <span className="progress-dot"></span>
                  Upcoming: {stats.upcoming}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {getRecentActivities().map(item => (
                <div key={item.id} className="activity-item">
                  <div className="activity-icon">
                    {getStatusIcon(item.status)} {getCategoryIcon(item.category)}
                  </div>
                  <div className="activity-details">
                    <span className="activity-name">{item.name}</span>
                    <span className="activity-date">{item.date}</span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${item.status}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Trips */}
          <div className="upcoming-section">
            <h2>Upcoming Plans</h2>
            <div className="upcoming-list">
              {getUpcomingItems().map(item => (
                <div key={item.id} className="upcoming-item">
                  <div className="upcoming-date">{item.date}</div>
                  <div className="upcoming-name">{item.name}</div>
                  <button 
                    className="btn-small"
                    onClick={() => markAsComplete(item.id)}
                  >
                    Mark Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Travel Map Snapshot */}
        <div className="map-section">
          <h2>Travel Map</h2>
          <div className="map-placeholder">
            <p>🌍 Interactive Map Coming Soon</p>
            <p>Pinned destinations will appear here</p>
          </div>
        </div>

        {/* Inspiration Feed */}
        <div className="inspiration-section">
          <h2>Inspiration Feed</h2>
          <div className="inspiration-carousel">
            {inspirationItems.map(item => (
              <div key={item.id} className="inspiration-card">
                <div className="inspiration-category">{getCategoryIcon(item.category)}</div>
                <h4>{item.title}</h4>
                <button className="btn-outline">Explore</button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section">
          <h2>Achievements</h2>
          <div className="badges-grid">
            <div className="badge">
              <span className="badge-icon">🏆</span>
              <span>First Completion</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🌎</span>
              <span>Travel Enthusiast</span>
            </div>
            <div className="badge">
              <span className="badge-icon">⚡</span>
              <span>Productive Streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;