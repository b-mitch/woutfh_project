import React from 'react';

export default function Results({ videos, handleVideoSelect }) {

    if (!videos) {
        return (
            <div className='no-results'>
                <h2>Submit a search to see results</h2>
            </div>
        )
    }
    
    return (
        <div className='results'>
            {videos.map((video) => {
                return <div key={video.id.videoId} classname='result' onClick={()=>handleVideoSelect(video.id.videoId)}>
                    <div className='thumbnail'>
                        <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.description}/>
                    </div>
                    <div className='title'>
                        <p>{video.snippet.title}</p>
                    </div>
                </div>
            })}
        </div>
    )
}