import React from 'react'
import Header from './Header';
import Content from './Content';
import Total from './Total';

export const Course = ({courses}) => {
    return(
    courses.map(course => {
        return (
            <>
            <Header course={course}/>
            <Content course={course}/>
            <Total course={course} />
            </>
        );
    })
    );
}

export default Course;