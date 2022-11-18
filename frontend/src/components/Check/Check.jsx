import React from 'react'
import './Check.css'

const Check = ({ type, name, onChange }) => {
  return (
      <label className="switch">
          <input type={type} name={name} onChange={onChange}/>
              <span className="slider"></span>
      </label>
  )
}

export default Check