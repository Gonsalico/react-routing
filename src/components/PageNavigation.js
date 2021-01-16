//Pàgina per navegar

import React from 'react';

export default (props) => {
    const{
        loading,
        showPrevLink,
        showNextLink,
        handlePrevClick,
        handleNextClick,
    }= props;
    
    return(
        <div className="nav-link-container">
            <a 
                href="#" 
                className={
                    `navlink ${showPrevLink ? 'show' : 'hide'}
                    ${loading ? 'greyed-out' : ' '}`
                }
                onClick={handlePrevClick}
            >
                Back
            </a>

            <a 
                href="#" 
                className={
                    `navlink ${showNextLink ? 'show' : 'hide'}
                    ${loading ? 'greyed-out' : ' '}`
                }
                onClick={handleNextClick}
            >
                Next
            </a>
        </div>
    )
}