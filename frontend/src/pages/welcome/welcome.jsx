import React from 'react'
import './welcome.css'
import Button from '../../components/Button/Button'
import { NavLink } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className='container'>
      <div className='container__div'>
        <h1>Jobs <br/> Web3</h1>
        <div className='container__button'>
          <NavLink to='/Jobs'>

          <Button text='Search for a Job' />
          </NavLink>
        
          <Button text='Post a Job' />
        </div>

      </div>
    </div>
  )
}

export default Welcome