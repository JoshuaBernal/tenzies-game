import React from 'react'

export default function Die(props) {
    const conditionalStyle = {
        backgroundColor: props.isHeld ? '#59E391' : 'white',
    }

    return (
        <button 
            onClick={props.toggle} 
            style={conditionalStyle} 
            aria-pressed={props.isHeld} 
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held": "not held"}`} 
            className='rounded-lg shadow-md w-11 p-2 m-2 font-extrabold text-xl'
        >
            {props.value}
        </button>
    )
}