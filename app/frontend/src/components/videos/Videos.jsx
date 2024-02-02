import React, { useEffect, useState } from 'react';
import 'reactjs-popup/dist/index.css';
import SearchBar from './SearchBar';
import Results from './Results';
import SelectedVideo from './SelectedVideo';
import SelectAppointment from './SelectAppointment';
import { getWorkouts, addVideo } from '../../util/helpers';

export default function Videos() {

    const [videos, setVideos] = useState(null);
    const [query, setQuery] = useState('');
    const [videoToAdd, setVideoToAdd] = useState(null);
    const [appts, setAppts] = useState(null);
    const [message, setMessage] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('current-user'));

    const key = window._env_.REACT_APP_YOUTUBE_API_KEY;

    const handleSubmit = () => {
        const search = [query];
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${search}&key=${key}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setVideos(data.items);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleVideoSelect = (id) => {
        setVideoToAdd(id);
        setAppts(null);
    }

    //HARDCODED USER ID
    const handleYes = async () => {
        //get workouts from DB
        const workouts = await getWorkouts(2);
        setAppts(workouts);
    }

    const handleAddVideo = async (e) => {
        const apptID = e.target.value
        const video = videoToAdd
        //add video to workout in DB
        const response = await addVideo(apptID, video);
        setMessage(response.message);
    }

    return (
        <div className='container'>
            <div className='wrapper'>
                <div className='videos'>
                    <div className='col-1'>
                        <h1>Videos</h1>
                        <SearchBar query={query} setQuery={setQuery} handleSubmit={handleSubmit} />
                        <SelectedVideo videoToAdd={videoToAdd} handleYes={handleYes} />
                        <SelectAppointment appts={appts} handleAddVideo={handleAddVideo} message={message}/>
                    </div>
                    <div className='col-2'>
                        <Results videos={videos} handleVideoSelect={handleVideoSelect} />
                    </div>
                </div>
                <div className="push"></div>
            </div>
            {videos ? (<div className="scroll-footer">
                <h6>&copy; Copyright. All Rights Reserved.</h6>
            </div>) : (<div className="noscroll-footer">
                <h6>&copy; Copyright. All Rights Reserved.</h6>
            </div>)}
        </div>
    )
}