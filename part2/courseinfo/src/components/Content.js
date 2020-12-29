import React from 'react'
import Part from './Part';

//Content renders the parts and their number of exercises

export const Content = ({course}) => {
    return (
        course.parts.map(part => {
            return <Part name={part.name} exercises={part.exercises} key={part.id}/>
        })
    )
}

export default Content;