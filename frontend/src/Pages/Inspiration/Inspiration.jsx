import React, { useState } from "react";
import "./Inspiration.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const Inspiration = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedItems, setSavedItems] = useState(new Set());

  // Featured Destinations Data
  const featuredDestinations = [
    {
      id: 1,
      name: "Bali",
      country: "Indonesia",
      image: "🌴",
      description: "Island paradise with stunning temples and beaches",
      category: "travel"
    },
    {
      id: 2,
      name: "Santorini",
      country: "Greece",
      image: "🏛️",
      description: "White-washed buildings with breathtaking sunset views",
      category: "travel"
    },
    {
      id: 3,
      name: "Machu Picchu",
      country: "Peru",
      image: "⛰️",
      description: "Ancient Incan citadel in the Andes mountains",
      category: "culture"
    },
    {
      id: 4,
      name: "Serengeti",
      country: "Tanzania",
      image: "🦁",
      description: "Wildlife safari experience with the Great Migration",
      category: "travel"
    },
    {
      id: 5,
      name: "Kyoto",
      country: "Japan",
      image: "🎎",
      description: "Traditional temples and cherry blossom seasons",
      category: "culture"
    },
    {
      id: 6,
      name: "Swiss Alps",
      country: "Switzerland",
      image: "🏔️",
      description: "Mountain adventures and picturesque landscapes",
      category: "fitness"
    }
  ];

  // Adventure Ideas Data
  const adventureIdeas = [
    {
      id: 1,
      name: "Scuba Diving",
      icon: "🤿",
      description: "Explore vibrant coral reefs and marine life",
      category: "fitness"
    },
    {
      id: 2,
      name: "Mountain Hiking",
      icon: "🥾",
      description: "Challenge yourself with breathtaking summit views",
      category: "fitness"
    },
    {
      id: 3,
      name: "Skydiving",
      icon: "🪂",
      description: "Experience the ultimate adrenaline rush from above",
      category: "fitness"
    },
    {
      id: 4,
      name: "Cultural Tours",
      icon: "🏛️",
      description: "Immerse yourself in local traditions and history",
      category: "culture"
    },
    {
      id: 5,
      name: "Photography Expedition",
      icon: "📸",
      description: "Capture stunning landscapes and cultural moments",
      category: "creative"
    },
    {
      id: 6,
      name: "Cooking Classes",
      icon: "👨‍🍳",
      description: "Learn authentic local cuisine from master chefs",
      category: "skills"
    }
  ];

  // Trending Suggestions Data
  const trendingSuggestions = [
    {
      id: 1,
      name: "Summer Escapes",
      tag: "Summer",
      destinations: ["Maldives", "Mediterranean", "California Coast"]
    },
    {
      id: 2,
      name: "Winter Wonders",
      tag: "Winter",
      destinations: ["Northern Lights", "Swiss Ski Resorts", "Ice Hotels"]
    },
    {
      id: 3,
      name: "Adventure Sports",
      tag: "Adventure",
      destinations: ["Bungee Jumping", "White Water Rafting", "Rock Climbing"]
    },
    {
      id: 4,
      name: "Cultural Immersion",
      tag: "Culture",
      destinations: ["Japan Temple Stay", "India Festival Tour", "Moroccan Souks"]
    }
  ];

  const categories = [
    { id: "all", name: "All", icon: "🌍" },
    { id: "travel", name: "Travel", icon: "✈️" },
    { id: "skills", name: "Skills", icon: "🎯" },
    { id: "fitness", name: "Fitness", icon: "💪" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "culture", name: "Culture", icon: "🏛️" }
  ];

  const toggleSavedItem = (itemId) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredDestinations = activeCategory === "all" 
    ? featuredDestinations 
    : featuredDestinations.filter(dest => dest.category === activeCategory);

  const filteredAdventures = activeCategory === "all" 
    ? adventureIdeas 
    : adventureIdeas.filter(adventure => adventure.category === activeCategory);

  return (

    <div>

      <Navbar />
      <div className="inspiration-page">
      
      
      {/* Page Header */}
      <header className="inspiration-header">
        <h1>Get Inspired</h1>
        <p className="subtitle">Explore destinations, adventures, and activities for your bucket list</p>
      </header>

      {/* Categories Filter */}
      <section className="categories-section">
        <div className="categories-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <h2>Featured Destinations</h2>
        <div className="destinations-grid">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="destination-card">
              <div className="card-image">{destination.image}</div>
              <div className="card-content">
                <h3>{destination.name}</h3>
                <p className="country">{destination.country}</p>
                <div className="card-hover">
                  <p className="description">{destination.description}</p>
                </div>
              </div>
              <button 
                className={`save-btn ${savedItems.has(`dest-${destination.id}`) ? 'saved' : ''}`}
                onClick={() => toggleSavedItem(`dest-${destination.id}`)}
              >
                {savedItems.has(`dest-${destination.id}`) ? '✓ Saved' : '+ Add to List'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Adventure Ideas */}
      <section className="adventures-section">
        <h2>Adventure Ideas & Experiences</h2>
        <div className="adventures-grid">
          {filteredAdventures.map(adventure => (
            <div key={adventure.id} className="adventure-card">
              <div className="adventure-icon">{adventure.icon}</div>
              <div className="adventure-content">
                <h3>{adventure.name}</h3>
                <p>{adventure.description}</p>
                <span className="category-tag">{adventure.category}</span>
              </div>
              <button 
                className={`save-btn ${savedItems.has(`adv-${adventure.id}`) ? 'saved' : ''}`}
                onClick={() => toggleSavedItem(`adv-${adventure.id}`)}
              >
                {savedItems.has(`adv-${adventure.id}`) ? '✓ Saved' : '+ Add to List'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Suggestions */}
      <section className="trending-section">
        <h2>Seasonal & Trending Suggestions</h2>
        <div className="trending-carousel">
          {trendingSuggestions.map(trend => (
            <div key={trend.id} className="trending-card">
              <div className="trend-header">
                <h3>{trend.name}</h3>
                <span className="trend-tag">{trend.tag}</span>
              </div>
              <ul className="trend-destinations">
                {trend.destinations.map((dest, index) => (
                  <li key={index}>• {dest}</li>
                ))}
              </ul>
              <button 
                className={`save-btn ${savedItems.has(`trend-${trend.id}`) ? 'saved' : ''}`}
                onClick={() => toggleSavedItem(`trend-${trend.id}`)}
              >
                {savedItems.has(`trend-${trend.id}`) ? '✓ Saved' : '+ Save Collection'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>
    
  );
};

export default Inspiration;