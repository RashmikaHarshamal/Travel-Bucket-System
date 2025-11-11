import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const createCustomIcon = (status, category) => {
  const getColor = (status) => {
    switch(status) {
      case 'completed': return '#27ae60';
      case 'in-progress': return '#f39c12';
      case 'upcoming': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getCategorySymbol = (category) => {
    switch(category) {
      case 'travel': return '✈️';
      case 'skills': return '🎓';
      case 'fitness': return '💪';
      case 'creative': return '🎨';
      default: return '⭐';
    }
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container" style="border-color: ${getColor(status)}">
        <div class="marker-icon" style="background: ${getColor(status)}">
          ${getCategorySymbol(category)}
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
};

// Map controller component for handling view changes
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const MapView = () => {
  const [bucketList, setBucketList] = useState([
    { 
      id: 1, 
      name: "Visit Tokyo", 
      status: "completed", 
      category: "travel", 
      date: "2023-05-15",
      coordinates: [35.6762, 139.6503],
      notes: "Amazing city with rich culture"
    },
    { 
      id: 2, 
      name: "Surf in Hawaii", 
      status: "in-progress", 
      category: "fitness", 
      date: "2023-08-20",
      coordinates: [21.3069, -157.8583],
      notes: "Learning to surf at Waikiki Beach"
    },
    { 
      id: 3, 
      name: "See Northern Lights in Norway", 
      status: "upcoming", 
      category: "travel", 
      date: "2024-01-10",
      coordinates: [69.6492, 18.9553],
      notes: "Trip to Tromsø planned"
    },
    { 
      id: 4, 
      name: "Yoga Retreat in Bali", 
      status: "upcoming", 
      category: "fitness", 
      date: "2024-03-15",
      coordinates: [-8.4095, 115.1889],
      notes: "One week wellness retreat"
    },
    { 
      id: 5, 
      name: "Photography in Iceland", 
      status: "not-started", 
      category: "creative", 
      date: "",
      coordinates: [64.9631, -19.0208],
      notes: "Landscape photography tour"
    },
    { 
      id: 6, 
      name: "Cooking Class in Italy", 
      status: "in-progress", 
      category: "skills", 
      date: "2024-02-15",
      coordinates: [41.9028, 12.4964],
      notes: "Learning authentic Italian cuisine"
    }
  ]);

  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    search: ""
  });

  const [mapCenter, setMapCenter] = useState([30, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    category: "travel",
    status: "not-started",
    date: "",
    notes: "",
    coordinates: [0, 0]
  });

  const mapRef = useRef();

  // Calculate statistics
  const stats = {
    total: bucketList.length,
    completed: bucketList.filter(item => item.status === "completed").length,
    inProgress: bucketList.filter(item => item.status === "in-progress").length,
    upcoming: bucketList.filter(item => item.status === "upcoming").length,
    notStarted: bucketList.filter(item => item.status === "not-started").length,
  };

  // Filter locations based on current filters
  const filteredLocations = bucketList.filter(location => {
    const matchesStatus = filters.status === "all" || location.status === filters.status;
    const matchesCategory = filters.category === "all" || location.category === filters.category;
    const matchesSearch = filters.search === "" || 
      location.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Handle map click to add new location
  const handleMapClick = (e) => {
    if (showAddForm) {
      setNewLocation({
        ...newLocation,
        coordinates: [e.latlng.lat, e.latlng.lng]
      });
    }
  };

  // Add new location to the map
  const addNewLocation = () => {
    if (!newLocation.name.trim() || newLocation.coordinates[0] === 0) return;

    const newItem = {
      id: Math.max(...bucketList.map(item => item.id)) + 1,
      ...newLocation
    };

    setBucketList([...bucketList, newItem]);
    setNewLocation({
      name: "",
      category: "travel",
      status: "not-started",
      date: "",
      notes: "",
      coordinates: [0, 0]
    });
    setShowAddForm(false);
  };

  // Update location status
  const updateLocationStatus = (id, newStatus) => {
    setBucketList(bucketList.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  // Fly to location on map
  const flyToLocation = (coordinates) => {
    setMapCenter(coordinates);
    setMapZoom(8);
  };

  // Reset map view to show all markers
  const resetMapView = () => {
    setMapCenter([30, 0]);
    setMapZoom(2);
    setSelectedLocation(null);
  };

  return (
    <div>
      <Navbar />
      
      <div className="map-page">
        {/* Page Header */}
        <div className="map-header">
          <div className="header-content">
            <h1>My Travel Map</h1>
            <button 
              className="btn-primary btn-large"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel Adding' : '+ Add Location'}
            </button>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Locations</span>
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

        {/* Filters Section */}
        <div className="map-filters">
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

            <div className="search-group">
              <input 
                type="text" 
                placeholder="Search locations..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            <button className="btn-outline" onClick={resetMapView}>
              Reset View
            </button>
          </div>

          {showAddForm && (
            <div className="add-location-info">
              <p>Click on the map to set the location for your new experience</p>
            </div>
          )}
        </div>

        <div className="map-content">
          {/* Sidebar with location list and stats */}
          <div className="map-sidebar">
            <div className="sidebar-section">
              <h3>Location Legend</h3>
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color completed"></div>
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color in-progress"></div>
                  <span>In Progress</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color upcoming"></div>
                  <span>Upcoming</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color not-started"></div>
                  <span>Not Started</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Locations ({filteredLocations.length})</h3>
              <div className="locations-list">
                {filteredLocations.map(location => (
                  <div 
                    key={location.id} 
                    className={`location-item ${location.status} ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedLocation(location);
                      flyToLocation(location.coordinates);
                    }}
                  >
                    <div className="location-marker">
                      <div className={`marker-dot ${location.status}`}></div>
                    </div>
                    <div className="location-info">
                      <div className="location-name">{location.name}</div>
                      <div className="location-details">
                        <span className="location-category">{location.category}</span>
                        <span className="location-date">{location.date || 'No date'}</span>
                      </div>
                    </div>
                    <div className="location-status">
                      {location.status.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredLocations.length === 0 && (
              <div className="empty-state">
                <p>No locations match your current filters.</p>
                <button 
                  className="btn-outline"
                  onClick={() => setFilters({ status: "all", category: "all", search: "" })}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Main Map Container */}
          <div className="map-container">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              onClick={handleMapClick}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <MapController center={mapCenter} zoom={mapZoom} />

              {filteredLocations.map(location => (
                <Marker
                  key={location.id}
                  position={location.coordinates}
                  icon={createCustomIcon(location.status, location.category)}
                  eventHandlers={{
                    click: () => {
                      setSelectedLocation(location);
                    }
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>{location.name}</h4>
                      <div className="popup-details">
                        <div className="popup-status">
                          <span className={`status-badge ${location.status}`}>
                            {location.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="popup-category">
                          Category: {location.category}
                        </div>
                        {location.date && (
                          <div className="popup-date">
                            Date: {new Date(location.date).toLocaleDateString()}
                          </div>
                        )}
                        {location.notes && (
                          <div className="popup-notes">
                            {location.notes}
                          </div>
                        )}
                      </div>
                      <div className="popup-actions">
                        {location.status !== 'completed' && (
                          <button 
                            className="btn-small"
                            onClick={() => updateLocationStatus(location.id, 'completed')}
                          >
                            Mark Complete
                          </button>
                        )}
                        <select 
                          value={location.status}
                          onChange={(e) => updateLocationStatus(location.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* New location marker when adding */}
              {showAddForm && newLocation.coordinates[0] !== 0 && (
                <Marker
                  position={newLocation.coordinates}
                  icon={createCustomIcon(newLocation.status, newLocation.category)}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>New Location: {newLocation.name || 'Unnamed'}</h4>
                      <p>Click "Add Location" to save this spot</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Add Location Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Location</h2>
              
              <div className="form-group">
                <label>Location Name *</label>
                <input 
                  type="text" 
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="e.g., Visit Paris, Learn Surfing in Hawaii..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newLocation.category}
                    onChange={(e) => setNewLocation({...newLocation, category: e.target.value})}
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
                    value={newLocation.status}
                    onChange={(e) => setNewLocation({...newLocation, status: e.target.value})}
                  >
                    <option value="not-started">Not Started</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={newLocation.date}
                  onChange={(e) => setNewLocation({...newLocation, date: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  value={newLocation.notes}
                  onChange={(e) => setNewLocation({...newLocation, notes: e.target.value})}
                  placeholder="Any additional details about this location..."
                  rows="3"
                />
              </div>

              <div className="coordinates-info">
                <label>Coordinates:</label>
                <span>
                  {newLocation.coordinates[0] !== 0 
                    ? `${newLocation.coordinates[0].toFixed(4)}, ${newLocation.coordinates[1].toFixed(4)}`
                    : 'Click on the map to set coordinates'
                  }
                </span>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-primary"
                  onClick={addNewLocation}
                  disabled={!newLocation.name.trim() || newLocation.coordinates[0] === 0}
                >
                  Add Location
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewLocation({
                      name: "",
                      category: "travel",
                      status: "not-started",
                      date: "",
                      notes: "",
                      coordinates: [0, 0]
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;