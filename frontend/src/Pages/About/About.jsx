import React from "react";
import "./About.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const About = () => {
  const features = [
    {
      icon: "📊",
      title: "Dashboard",
      description: "Track your progress and view recent activities with beautiful statistics and visualizations"
    },
    {
      icon: "🎯",
      title: "Bucket List",
      description: "Add, edit, and manage your dream experiences with categories and priority levels"
    },
    {
      icon: "🗺️",
      title: "Map View",
      description: "Visualize your travel destinations and experiences on an interactive world map"
    },
    {
      icon: "📅",
      title: "Planner",
      description: "Schedule trips, set reminders, and organize your travel itinerary efficiently"
    },
    {
      icon: "📔",
      title: "Journal",
      description: "Record memories, upload photos, and document your travel experiences"
    },
    {
      icon: "💡",
      title: "Inspiration",
      description: "Explore new destinations and adventure ideas from around the world"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Add Experiences",
      description: "Start by adding your dream destinations and activities to your bucket list"
    },
    {
      number: "2",
      title: "Track Progress",
      description: "Monitor your achievements and upcoming adventures on the dashboard"
    },
    {
      number: "3",
      title: "Plan Trips",
      description: "Use the planner to organize your travel schedule and set reminders"
    },
    {
      number: "4",
      title: "Record Memories",
      description: "Document your experiences in the journal with photos and notes"
    },
    {
      number: "5",
      title: "Get Inspired",
      description: "Discover new destinations and activities in the inspiration section"
    }
  ];

  return (
    <div>
      <Navbar />
      
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>About Travel Bucket System</h1>
            <p className="hero-subtitle">Plan, track, and explore your dream adventures</p>
            <div className="hero-description">
              <p>
                Travel Bucket System helps you organize and track your bucket list experiences, 
                plan upcoming trips, get inspired by new destinations, and preserve your travel memories 
                in one beautiful, intuitive platform.
              </p>
              <div className="hero-highlights">
                <span className="highlight-badge">🚀 No Login Required</span>
                <span className="highlight-badge">💫 Easy to Use</span>
                <span className="highlight-badge">🎉 Completely Free</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <span className="card-icon">🏔️</span>
              <span>Mountain Adventure</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">🏖️</span>
              <span>Beach Getaway</span>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon">🏛️</span>
              <span>Cultural Experience</span>
            </div>
          </div>
        </section>

        {/* System Description */}
        <section className="system-description">
          <div className="description-content">
            <h2>What Our System Does</h2>
            <div className="description-grid">
              <div className="description-item">
                <div className="description-icon">🎯</div>
                <div>
                  <h3>Track Bucket List Experiences</h3>
                  <p>Never forget your dream destinations and activities. Keep everything organized in one place.</p>
                </div>
              </div>
              <div className="description-item">
                <div className="description-icon">📅</div>
                <div>
                  <h3>Plan Upcoming Trips</h3>
                  <p>Schedule your adventures, set reminders, and organize your travel itinerary with ease.</p>
                </div>
              </div>
              <div className="description-item">
                <div className="description-icon">💡</div>
                <div>
                  <h3>Get Inspired</h3>
                  <p>Discover new destinations and activities to add to your ever-growing bucket list.</p>
                </div>
              </div>
              <div className="description-item">
                <div className="description-icon">📔</div>
                <div>
                  <h3>Journal Memories</h3>
                  <p>Document your experiences with photos, notes, and memories that last a lifetime.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="key-features">
          <div className="features-header">
            <h2>Key Features</h2>
            <p>Everything you need to plan and document your adventures</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use Section */}
        <section className="quick-guide">
          <div className="guide-header">
            <h2>Get Started in 5 Simple Steps</h2>
            <p>Begin your travel planning journey with our easy-to-follow guide</p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Adventure?</h2>
            <p>Join thousands of travelers who are already planning their dream experiences</p>
            <div className="cta-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Dreams Planned</span>
              </div>
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Countries Covered</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="about-footer">
          <div className="footer-content">
            <p>Made with ❤️ for travelers and adventurers around the world</p>
            <p className="footer-note">Travel Bucket System • No login required • Always free</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;