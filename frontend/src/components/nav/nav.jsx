import React from 'react'
import './nav.css'
import Button from '../Button/Button'
import BoxConnect from '../BoxConnect/BoxConnect';
import { useContext } from 'react'
import { UserContext } from '../../context/userProvider'
import { NavLink } from 'react-router-dom'


const Nav = () => {
  
  const { box, openBox, conectado, currentAccount } = useContext(UserContext)



  return (
    <nav className='nav'>
      <NavLink className='nav__link' to='/'>
      <Button text='Home' className='nav__button1'/>
      </NavLink>
      <Button onClick={conectado ? null : openBox} className='nav__button2' text={conectado ? currentAccount :'connect wallet'}/>
      {box && <BoxConnect/>}
    </nav>
  )
}

export default Nav