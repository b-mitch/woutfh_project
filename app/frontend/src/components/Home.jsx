import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import { getWorkouts, getUser } from '../util/helpers';

export default function Home() {

    const navigate = useNavigate();
    const [appointments, setAppointments] = useState(null);
    const [user, setUser] = useState(null);
    const [scrollFooter, setScrollFooter] = useState(false);

    useEffect(() => {
        (async () => {
            const current_user = await getUser();
            setUser(current_user);
            const workouts = await getWorkouts();
            setAppointments(workouts);
            if (!current_user) navigate('/login');
        })();
        // Check if the route is '/' and this is the initial load
        if (localStorage.getItem('refresh_token') && !sessionStorage.getItem('reloaded')) {
            // Set a session storage flag to prevent further reloads
            sessionStorage.setItem('reloaded', 'true');
            // Trigger a page reload
            window.location.reload();
        }
    }, [])

    const workoutVideo = (video) => {
        setScrollFooter(true);
        const src=`https://www.youtube-nocookie.com/embed/${video}`
        return <iframe
        width="100%" height="400px" class="youtubeVideo" src={src}></iframe>
    }

    function Workouts() {
        if (!appointments?.length) return <p>No upcoming classes scheduled!</p>
        return (
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>With</th>
                    </tr>
                </thead>
                    {appointments.map((appointment, i) => {
                    return <tbody key={i}>
                        <tr  className='home-workouts'>
                            <td>{appointment.date}</td><td>{appointment.time}</td><td>{appointment.users.find(partner => partner != user.first_name)}</td>
                        </tr>
                        <tr className='home-player'>
                            <td colSpan='3'>{appointment.video ? workoutVideo(appointment.video) : <Link to="videos">Add video</Link>}</td>
                        </tr></tbody>
                    })}
            </table>
        )
    }

    return (
        <div className='home container'>
            <div className='wrapper'>
                <div className='body'>
                    <h1>Welcome{user ? `, ${user.first_name}! ` : '!'} Let's Learn to Shuffle!</h1>
                </div>
                <div className='appointments'>
                    <h2>Upcoming Classes</h2>
                    <Workouts />
                </div>
                <div className="push"></div>
            </div>
            {scrollFooter ? (<div className="scroll-footer">
                <h6>&copy; Copyright. All Rights Reserved.</h6>
            </div>) : (<div className="noscroll-footer">
                <h6>&copy; Copyright. All Rights Reserved.</h6>
            </div>)}
        </div>
    )
}