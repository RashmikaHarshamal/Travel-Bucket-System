import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Remove or comment this line
// import Home from './Home/Home'; // ✅ Correct path based on your folder structure
// import NavigationBar from './NavigationBar/NavigationBar';
// import LogIn from './LogIn/LogIn';
// import DashBoard from './DashBoard/DashBoard';
// import Footer from './Footer/Footer';
// import CareerPath from './CareerPath/CareerPath';
// import SkillTracker from './SkillTracker/SkillTracker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
