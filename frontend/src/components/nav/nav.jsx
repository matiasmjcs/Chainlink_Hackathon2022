import React from 'react'
import './nav.css'
import Button from '../Button/Button'

const Nav = () => {
  return (
    <nav className='nav'>
      <Button text='Home' className='nav__button1'/>
      <Button className='nav__button2' text='connect wallet'/>

    </nav>
  )
}

export default Nav