import React from 'react'

export default function Alert(props) {
    return (
        <div className='container-fluid d-flex justify-content-center position-absolute py-4'>
        <div className={`alert w-25 text-wrap text-center m-0 ${props.alertType}`} role="alert">
            {props.message}
        </div>
        </div>
    )
}
