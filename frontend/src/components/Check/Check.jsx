import React from 'react'
import './Check.css'

const Check = ({ type, name, onChange }) => {
  return (
      <label class="switch">
          <input type={type} name={name} onChange={onChange}/>
              <span class="slider"></span>
      </label>
  )
}

export default Check