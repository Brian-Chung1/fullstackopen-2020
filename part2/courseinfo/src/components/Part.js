import React from 'react'

export const Part = ({name, exercises, key}) => {
    return (
        <p key={key}>{name} {exercises}</p>
    )
}

export default Part;