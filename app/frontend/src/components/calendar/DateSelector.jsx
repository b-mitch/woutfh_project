import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Availability from './Availability';

export default function DateSelector({ 
    clickedDate,
    onClick,
    times,
    setTimes
}) {

    const [value, setValue] = useState(new Date());

    function onChange(nextValue) {
    setValue(nextValue);
}

    return (
        <div className='date-selector'>
            {!clickedDate ? <p>*Select a date below to change availability & schedule classes*</p> : ''}
            <Calendar
                onChange={onChange}
                value={value}
                onClickDay={onClick}
                />
            <Availability 
                clickedDate={clickedDate} 
                times={times}
                setTimes={setTimes}
                />
        </div>
    );
    }