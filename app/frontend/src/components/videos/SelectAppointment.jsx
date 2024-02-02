import React from 'react';
import { Link } from 'react-router-dom';

export default function SelectAppointment({ 
    appts, 
    handleAddVideo,
    message
}) {

    if (!appts) {
        return (
            <div className='select-appt'>
                <p>And don't forget to <Link to='../availability'>schedule classes </Link>first to add videos to</p>
            </div>
        )
    }

    const successMessage = () => {
        return (
            <div
                id="success"
                style={{
                display: message ? '' : 'none',
                }}>
                <h3>{message}</h3>
            </div>
            );
    };
    
    return (
        <div className='select-appt'>
            <p>Which appointment?</p>
            {successMessage()}
            {appts.map(appt => {
                return <button key={appt.id} onClick={handleAddVideo}
                value={appt.id} className="submit" type="submit">{appt.date}: {appt.time}</button>
            })}
        </div>
    )
}