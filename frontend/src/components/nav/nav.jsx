import React, { useState } from 'react'
import './nav.css'
import Button from '../Button/Button'
import BoxConnect from '../BoxConnect/BoxConnect';
import { useContext } from 'react'
import { UserContext } from '../../context/userProvider'

const Nav = () => {
  
  const { box, openBox, conectado, currentAccount } = useContext(UserContext)



  return (
    <nav className='nav'>
      <Button text='Home' className='nav__button1'/>
      <Button onClick={conectado ? null : openBox} className='nav__button2' text={conectado ? currentAccount :'connect wallet'}/>
      {box && <BoxConnect/>}
    </nav>
  )
}

export default Nav