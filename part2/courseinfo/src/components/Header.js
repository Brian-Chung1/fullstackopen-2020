import React from 'react'

// Header takes care of rendering the name of the course

export const Header = ({course}) => {
    return (
        <h2>{course.name}</h2>
    )
}

export default Header;