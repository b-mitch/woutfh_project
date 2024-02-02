import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { findMutualFreeTime, getUsers, getUser, getAvailability, createWorkout } from '../../util/helpers'

export default function Scheduler({ 
    clickedDate,
    userAvail 
}) {

    // const [users, setUsers] = useState(null);
    const [fam, setFam] = useState(null);
    const [famName, setFamName] = useState(null);
    const [famAvail, setFamAvail] = useState(null);
    const [checkedFam, setCheckedFam] = useState(null);
    const [noAvail, setNoAvail] = useState(false);
    const [time, setTime] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!clickedDate) {
            navigate("../")
        } else {
            getFam();
        }
    }, [clickedDate])

    if (!clickedDate) return;

    const month = clickedDate.month;
    const day = clickedDate.day;
    const year = clickedDate.year

    const getFam = async () => {
        const fetchedUser = await getUser();
        const currentUser = fetchedUser.first_name
        //get all members except current user
        const allUsers = await getUsers();
        const notCurrentUser = allUsers.filter(user => user.first_name !== currentUser && user.first_name !== 'admin');
        setFam(notCurrentUser)
    }

    const getDate = () => {
        if (clickedDate) {
            return `${year}-${month}-${day}`;
        }
    }

    const handleCheckboxChange = async (e) => {
        const name = e.target.name;
        setFamName(name);

        //select fam member from fam array
        const selectedFam = fam.find(member => member.first_name === name);
        setCheckedFam(selectedFam)

        //check if is already checked
        if (selectedFam.isChecked) {
            const uncheck = [...fam]
            for (const member of uncheck) {
                if (member.first_name === name) member.isChecked =  false;
            }
            setFam(uncheck);
        } else {
            //set availability state of fam
            const famAvailOnDate = await getAvailability(selectedFam.id, year, month, day);
            if (!famAvailOnDate) {
                setNoAvail(true);
            } else {
                setFamAvail(famAvailOnDate)
                setNoAvail(false);
            }
            //reset checked state in each user
            const newFam = [...fam]
            for (const member of newFam) {
                if (member.first_name === name) {
                    member.isChecked = true;
                } else {
                    member.isChecked = false;
                }
            }
            setFam(newFam);
        }
    }

    //HARDCODED USER ID
    const handleSubmit = async () => {
        //add workout to db
        await createWorkout(getDate(), time, [checkedFam.id, 2]);
        //reset fam checkboxes
        const newFam = [...fam]
        for (const member of newFam) {
            member.isChecked = false;
        }
        setFam(newFam);
        navigate('/');
    }

    function Fam(){
        if (!fam) return;
        return (
            <div className='select-users'>
                    {fam.map(member => {
                    return <label><input 
                        type="checkbox" 
                        name={member.first_name} 
                        checked={member.isChecked} 
                        onChange={handleCheckboxChange}
                        className='user-checkbox'/>{member.first_name}</label>
                    })}
            </div>
        )
    }

    function AvailableTimes(){
        if (!famAvail && !noAvail) return;
        if (fam.every(member => member.isChecked === false)) return
        if (noAvail) return <p>{famName} has no availability for this date</p>
        let availableTimes =  findMutualFreeTime(userAvail, famAvail);
        availableTimes = availableTimes.map(time => time.join('-'))
        return (
            <div className='available-times'>
                <h2>Select a time interval below to schedule!</h2>
                <ul>
                    {availableTimes.map(time => {
                    return <li><label><input 
                        type="checkbox" 
                        name={time}  
                        onChange={()=>{setTime(time)}} style={{position: 'absolute',
                        opacity: 0,
                        cursor: 'pointer',
                        height: 0,
                        width: 0}}
                        className='time-checkbox'/>{time}</label></li>
                    })}
                </ul>
            </div>
        )
    }

    function ScheduleTime() {
        if (!time || !clickedDate || !fam) return;
        if (fam.every(member => member.isChecked === false)) return
        return (
            <div className='schedule-time'>
                <p>Schedule {time} on {getDate()} with {famName}??</p>
                <button id='yes-btn' onClick={handleSubmit} className="submit" type="submit">Yes!</button>
            </div>
        )
    }

    return(
        <div className='scheduler'>
            <h1>Schedule class for {getDate()}</h1>
            <h2>Select fam to see mutual free time!</h2>
            <Fam />
            <AvailableTimes />
            <ScheduleTime />
        </div>
    )
}