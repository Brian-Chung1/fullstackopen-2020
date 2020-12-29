import React from 'react'

export const Total = ({course}) => {
    const totalNum = course.parts.reduce((acc, part) => acc + part.exercises, 0);
    return (
        <p>Total of {totalNum} exercises</p>
    )
}

export default Total;