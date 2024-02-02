import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DateSelector from './DateSelector';
import Scheduler from './Scheduler';
import { getAvailability } from '../../util/helpers';

export default function CalendarContainer() {

    const [clickedDate, setClickedDate] = useState(null);
    const [times, setTimes] = useState([]);

    useEffect(() => {
        if (clickedDate) fetchAvailability();
    }, [clickedDate])

    const fetchAvailability = async () => {
        const month = clickedDate.month;
        const day = clickedDate.day;
        const year = clickedDate.year;
        const userAvailability = await getAvailability(year, month, day);
        setTimes(userAvailability);
    }

    const onClick = (e) => {
        const date = { 
            month: e.getMonth()+1,
            day: e.getDate(),
            year: e.getFullYear()
        }
       setClickedDate(date);
    }

    return (
        <div className='container'>
            <div className='wrapper'>
                <Routes>
                    <Route 
                    path="" 
                    element={
                        <DateSelector 
                            clickedDate={clickedDate}
                            onClick={onClick}
                            times={times}
                            setTimes={setTimes}
                            />
                        } 
                    />
                    <Route 
                    path="/schedule" 
                    element={
                        <Scheduler 
                            clickedDate={clickedDate}
                            userAvail={times} />
                        } 
                    />
                </Routes>
                <div className="push"></div>
            </div>
            {clickedDate ? (<div className="scroll-footer">
                <h6>&copy; Copyright. All Rights Reserved.</h6>
            </div>) : (<div className="noscroll-footer">
                <h6>&copy; Copyright. All Rights Reserved.</h6>
            </div>)}
        </div>
        
    )
}