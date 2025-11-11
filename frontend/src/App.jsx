// import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, {useState} from 'react';
import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/DashBoard/DashBoard";
import LogIn from "./Pages/LogIn/LogIn";
import CreateAccount from "./Pages/createAccount/createAccount";
import BucketList from "./Pages/BucketList/BucketList";
import MapView from "./Pages/MapView/MapView";
import Inspiration from "./Pages/Inspiration/Inspiration";
import Journal from "./Pages/Journal/Journal";
import Planner from "./Pages/Planner/Planner";
import About from "./Pages/About/About";
import Navbar from "./Components/NavigationBarLogged/NavigationBarLogged";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/bucket-list" element={<BucketList />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
    
  );
};

export default App;
