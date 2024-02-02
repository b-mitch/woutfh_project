import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        sessionStorage.removeItem('reloaded')
        window.location.reload();
    }

    if (localStorage.getItem('refresh_token')) {
        return (
            <nav>
                <div className="heading">
                    <h2>Workout From Home</h2>
                </div>
                <ul>
                    <li>
                        <NavLink to="/"><a>Home</a></NavLink>
                    </li>
                    <li>
                        <NavLink to="/availability"><a>Calendar</a></NavLink>
                    </li>
                    <li>
                        <NavLink to="/videos"><a>Videos</a></NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact"><a>Get in Touch</a></NavLink>
                    </li>
                    <li>
                        <button className='logout btn' onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        )
    } else {
        return (
            <nav>
                <div className="heading">
                    <h2>Workout From Home</h2>
                </div>
                <ul>
                    <li>
                        <NavLink to="/register"><a>Register</a></NavLink>
                    </li>
                    <li>
                        <NavLink to="/login"><a>Login</a></NavLink>
                    </li>
                    <li>
                        <NavLink to='/contact'><a>Get in Touch</a></NavLink>
                    </li>
                </ul>
            </nav>
        )
    }
  }