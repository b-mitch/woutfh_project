import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateAvailability, addAvailability } from '../../util/helpers';

export default function Availability({ 
    clickedDate, 
    times,
    setTimes
}) {

    const [toAdd, setToAdd] = useState({});

    if (!clickedDate) return;

    const month = clickedDate.month;
    const day = clickedDate.day;
    const year = clickedDate.year

    const handleChange = (e) => {
        let element = e.target;
        //update toAdd state depending on whether start or end time is updated
        if (element.getAttribute('id') === 'start') {
            let availToAdd = {...toAdd}
            availToAdd['start'] = element.value
            setToAdd(availToAdd)
        }
        if (element.getAttribute('id') === 'end') {
            let availToAdd = {...toAdd}
            availToAdd['end'] = element.value
            setToAdd(availToAdd)
        }
    }

    const handleSubmit = async (e) => { 
        let newAvailability = times ? [...times] : [];
        newAvailability.push(toAdd);
        setTimes(newAvailability);
        if (times?.length) {
            await updateAvailability(year, month, day, newAvailability);
        } else {
            await addAvailability(year, month, day, newAvailability);
        }
        //reset input values
        const start = document.getElementById('start');
        const end = document.getElementById('end')
        start.value = '';
        end.value = '';
    }

    const handleDelete = async (i) => {
        //update user availability by removing the selected interval
        const newAvailability = times.filter((interval, index) => index !== i);
        setTimes(newAvailability);
        await updateAvailability(year, month, day, newAvailability);
    }

    const getDate = () => {
        if (clickedDate) {
            return month + ' / ' + day;
        }
    }

    function FreeTime(){
        if (!times?.length) return;
        return (
            <div className='freetime'>
                <h2>Your Availability:</h2>
                <table>
                    <tbody>
                        {times.map((interval, i) => {
                        return <tr key={i}>
                            <td>{interval.start + ' - ' + interval.end}</td>
                            <td><button onClick={() => {handleDelete(i)}}>Remove</button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className='availability' style={{display: !clickedDate ? 'none' : ''}}>
            <h1>{getDate()} Availability</h1>
            <h2>Add your availability below!</h2>
            <div className='input-container'>
                <label for='start'>Start:</label>
                <input id='start' className='avail-input' type='time' min='6:00' max='19:00' onChange={handleChange}></input>
                <label for='end'>End:</label>
                <input id='end' className='avail-input' type='time' min='6:00' max='19:00' onChange={handleChange}></input>
                <button onClick={handleSubmit} className="submit" type="submit">Submit</button>
            </div>
            <FreeTime />
            <div className='freetime' style={{
          display: !times?.length ? 'none' : '',
        }}>
            <Link to="./schedule">Schedule Workout</Link>
        </div>
        </div>
    )
}