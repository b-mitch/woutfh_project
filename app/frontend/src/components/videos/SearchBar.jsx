import React from 'react';

export default function SearchBar({ query, setQuery, handleSubmit }) {

    return(
        <div className="search-bar">
            <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            type="search"
            id="video-search"
            placeholder="Search Youtube"
            name="search" 
            />
            <button onClick={handleSubmit} className="submit btn" type="submit">Search</button>
        </div>
    )
}