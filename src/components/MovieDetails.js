//Detalls de les pel·lícules

import React from 'react';

export default (url) => {
    
    const neourl = `https://api.themoviedb.org/3/movie/${url}?api_key=417f399abcc8fa6b50750d4fc444e2fe&language=en-US`;

    axios.get(neourl).then(resp=>{
       
        console.warn(resp.data);
        this.setState({
            results2: resp.data,
        })
    })


    return(
        <div className="infowindow">
        <h1>{this.state.results2.title}</h1>
        <p>{this.state.results2.popularity}</p>
        </div>
    )
}