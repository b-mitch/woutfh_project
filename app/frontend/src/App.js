import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CalendarContainer from './components/calendar/CalendarContainer';
import Videos from './components/videos/Videos';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotFound from './components/NotFound';
import ContactUs from './components/ContactUs';
import Test from './components/Test';

function App() {

  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/test" element={<Test />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/availability/*" element={<CalendarContainer />} />
          <Route path="/videos" element={<Videos />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
