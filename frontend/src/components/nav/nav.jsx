import React from 'react'
import './nav.css'
import Button from '../Button/Button'
import BoxConnect from '../BoxConnect/BoxConnect';
import { useContext } from 'react'
import { UserContext } from '../../context/userProvider'
import { NavLink } from 'react-router-dom'


const Nav = () => {
  
  const { box, openBox, active, view, red, redState, conectado, Switch } = useContext(UserContext)



  return (
    <nav className='nav'>
      <NavLink className='nav__link' to='/'>
      <Button text='Home' className='nav__button1'/>
      </NavLink>
      {conectado && red === false ? <Button onClick={Switch} className='nav__button3' text={redState}/> : ''}
      <Button onClick={active ? null : openBox} className='nav__button2' text={active ? view :'connect wallet'}/>
      {box && <BoxConnect/>}
    </nav>
  )
}

export default Nav