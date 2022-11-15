import React from 'react'
import './welcome.css'
import Button from '../../components/Button/Button'

const Welcome = () => {
  return (
    <div className='container'>
      <div className='container__div'>
        <h1>Jobs <br/> Web3</h1>
        <div className='container__button'>
          <Button text='Search for a Job' />
          <Button text='Post a Job' />
        </div>

      </div>
    </div>
  )
}

export default Welcome