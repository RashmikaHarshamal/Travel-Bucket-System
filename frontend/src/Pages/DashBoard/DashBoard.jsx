import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import Navbar from "../../Components/NavigationBarLogged/NavigationBarLogged";

const Dashboard = () => {
  const [bucketList, setBucketList] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, upcoming: 0, categories: {} });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("activities");

  useEffect(() => {
    const data = [
      { id: 1, name: "Visit Japan",         status: "completed",  date: "2023-05-15", category: "travel"   },
      { id: 2, name: "Learn Surfing",        status: "in-progress",date: "2023-08-20", category: "skills"   },
      { id: 3, name: "See Northern Lights",  status: "upcoming",   date: "2024-01-10", category: "travel"   },
      { id: 4, name: "Run Marathon",         status: "completed",  date: "2023-10-05", category: "fitness"  },
      { id: 5, name: "Write Novel",          status: "in-progress",date: "2023-11-15", category: "creative" },
      { id: 6, name: "Learn Guitar",         status: "upcoming",   date: "2024-03-01", category: "skills"   },
      { id: 7, name: "Visit Italy",          status: "upcoming",   date: "2024-06-15", category: "travel"   },
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
      total:      data.length,
      completed:  data.filter(i => i.status === "completed").length,
      inProgress: data.filter(i => i.status === "in-progress").length,
      upcoming:   data.filter(i => i.status === "upcoming").length,
      categories,
    });
  };

  const getStatusIcon  = (s) => ({ completed: "✅", "in-progress": "🔄", upcoming: "📅" }[s] ?? "⏳");
  const getCategoryIcon = (c) => ({ travel: "✈️", skills: "🎓", fitness: "💪", creative: "🎨" }[c] ?? "⭐");
  const getProgressPct  = () => stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentActivities = [...bucketList].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5);
  const upcomingItems    = bucketList.filter(i => i.status==="upcoming").sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3);

  const markAsComplete = (id) => {
    const updated = bucketList.map(i => i.id===id ? {...i, status:"completed"} : i);
    setBucketList(updated);
    calculateStats(updated);
  };

  const inspirationItems = [
    { id:1, title:"Top 10 European Destinations", category:"travel"   },
    { id:2, title:"Learn a New Language in 30 Days",category:"skills"  },
    { id:3, title:"Mountain Hiking Adventures",   category:"fitness"  },
    { id:4, title:"Creative Writing Prompts",     category:"creative" },
  ];

  const achievements = [
    { icon:"🏆", label:"First Completion", color:"gold"  },
    { icon:"🌎", label:"Travel Enthusiast",color:"cyan"  },
    { icon:"⚡", label:"Productive Streak", color:"pink"  },
    { icon:"🔥", label:"On Fire",           color:"orange"},
    { icon:"🎯", label:"Goal Setter",       color:"lime"  },
    { icon:"💎", label:"Diamond Club",      color:"electric"},
  ];

  const pct = getProgressPct();

  return (
    <div>
      <Navbar />
      <div className="db-page">

        {/* ── HERO HEADER ── */}
        <header className="db-hero">
          <div className="db-hero__left">
            <p className="db-hero__eyebrow">🌟 Your Life Journey</p>
            <h1 className="db-hero__title">Dashboard</h1>
            <p className="db-hero__sub">Track every adventure, skill & dream you're chasing.</p>
            <div className="db-hero__actions">
              <button className="btn-primary">＋ Add Experience</button>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="filter-dropdown"
              >
                <option value="all">All Categories</option>
                <option value="travel">✈️ Travel</option>
                <option value="skills">🎓 Skills</option>
                <option value="fitness">💪 Fitness</option>
                <option value="creative">🎨 Creative</option>
              </select>
            </div>
          </div>

          {/* Big radial progress in hero */}
          <div className="db-hero__ring-wrap">
            <div className="ring-label">Overall</div>
            <div
              className="hero-ring"
              style={{"--pct": `${pct}%`}}
            >
              <div className="hero-ring__inner">
                <span className="hero-ring__num">{pct}%</span>
                <span className="hero-ring__tag">complete</span>
              </div>
            </div>
            <div className="ring-dots">
              <span className="rdot rdot--lime" />  Completed
              <span className="rdot rdot--orange" />In Progress
              <span className="rdot rdot--cyan" />  Upcoming
            </div>
          </div>
        </header>

        {/* ── STAT ORBS ROW ── */}
        <section className="db-orbs">
          {[
            { label:"Total",      value: stats.total,      cls:"orb--electric", icon:"🗂️" },
            { label:"Completed",  value: stats.completed,  cls:"orb--lime",     icon:"✅" },
            { label:"In Progress",value: stats.inProgress, cls:"orb--orange",   icon:"🔄" },
            { label:"Upcoming",   value: stats.upcoming,   cls:"orb--cyan",     icon:"📅" },
          ].map(o => (
            <div key={o.label} className={`orb ${o.cls}`}>
              <span className="orb__icon">{o.icon}</span>
              <span className="orb__num">{o.value}</span>
              <span className="orb__label">{o.label}</span>
            </div>
          ))}
        </section>

        {/* ── BENTO GRID ── */}
        <section className="db-bento">

          {/* CELL A — Activities + Upcoming tabs */}
          <div className="bento-cell bento-cell--A">
            <div className="cell-tabs">
              <button
                className={`cell-tab ${activeTab==="activities"?"cell-tab--on":""}`}
                onClick={()=>setActiveTab("activities")}
              >Recent</button>
              <button
                className={`cell-tab ${activeTab==="upcoming"?"cell-tab--on":""}`}
                onClick={()=>setActiveTab("upcoming")}
              >Upcoming</button>
            </div>

            {activeTab === "activities" && (
              <ul className="act-list">
                {recentActivities.map(item => (
                  <li key={item.id} className="act-row">
                    <div className="act-icons">
                      {getStatusIcon(item.status)}<br/>{getCategoryIcon(item.category)}
                    </div>
                    <div className="act-info">
                      <span className="act-name">{item.name}</span>
                      <span className="act-date">{item.date}</span>
                    </div>
                    <span className={`badge badge--${item.status}`}>
                      {item.status.replace("-"," ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "upcoming" && (
              <ul className="act-list">
                {upcomingItems.map(item => (
                  <li key={item.id} className="act-row">
                    <div className="act-icons">{getCategoryIcon(item.category)}</div>
                    <div className="act-info">
                      <span className="act-name">{item.name}</span>
                      <span className="act-date act-date--hot">{item.date}</span>
                    </div>
                    <button className="btn-go" onClick={()=>markAsComplete(item.id)}>
                      Start →
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CELL B — Category breakdown */}
          <div className="bento-cell bento-cell--B">
            <h3 className="cell-title">Categories</h3>
            <div className="cat-bars">
              {Object.entries(stats.categories).map(([cat, count], i) => {
                const colors = ["var(--hot-pink)","var(--cyan)","var(--lime)","var(--orange)"];
                const pctBar = Math.round((count / stats.total) * 100);
                return (
                  <div key={cat} className="cat-bar-row">
                    <div className="cat-bar-meta">
                      <span>{getCategoryIcon(cat)} {cat}</span>
                      <span className="cat-count">{count}</span>
                    </div>
                    <div className="cat-bar-track">
                      <div
                        className="cat-bar-fill"
                        style={{ width:`${pctBar}%`, background: colors[i % colors.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CELL C — Map placeholder (tall) */}
          <div className="bento-cell bento-cell--C">
            <h3 className="cell-title">🌍 Travel Map</h3>
            <div className="map-blob">
              <div className="map-pulse" />
              <p className="map-text">Interactive Map</p>
              <p className="map-sub">Coming Soon</p>
            </div>
          </div>

          {/* CELL D — Inspiration cards (horizontal scroll) */}
          <div className="bento-cell bento-cell--D">
            <h3 className="cell-title">✨ Inspiration Feed</h3>
            <div className="insp-scroll">
              {inspirationItems.map((item, i) => {
                const gradients = [
                  "linear-gradient(135deg,rgba(255,45,120,0.25),rgba(79,70,229,0.15))",
                  "linear-gradient(135deg,rgba(79,70,229,0.25),rgba(6,182,212,0.15))",
                  "linear-gradient(135deg,rgba(163,230,53,0.25),rgba(6,182,212,0.15))",
                  "linear-gradient(135deg,rgba(251,146,60,0.25),rgba(255,45,120,0.15))",
                ];
                return (
                  <div key={item.id} className="insp-card" style={{background:gradients[i]}}>
                    <span className="insp-icon">{getCategoryIcon(item.category)}</span>
                    <p className="insp-title">{item.title}</p>
                    <button className="btn-outline">Explore</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CELL E — Achievements */}
          <div className="bento-cell bento-cell--E">
            <h3 className="cell-title">🏅 Achievements</h3>
            <div className="ach-grid">
              {achievements.map((a,i) => (
                <div key={i} className={`ach-badge ach-badge--${a.color}`}>
                  <span className="ach-icon">{a.icon}</span>
                  <span className="ach-label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default Dashboard; 