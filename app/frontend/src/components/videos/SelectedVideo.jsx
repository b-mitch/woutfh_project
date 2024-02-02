import React from 'react';

export default function SelectedVideo({ videoToAdd, handleYes }) {

    if (!videoToAdd) {
        return (
            <div className='selected-video'>
                <p>Select a video to view and add it to a scheduled class</p>
            </div>
        )
    }
    
    const src=`https://www.youtube.com/embed/${videoToAdd}`
    
    return (
        <div className='selected-video'>
            <iframe
            width="100%" height="400px" class="youtubeVideo" src={src}></iframe>
            
            <p>Add video to a class?</p>
            <button id='yes-btn' onClick={handleYes}
className="submit" type="submit">Yes!</button>
        </div>
    )
}