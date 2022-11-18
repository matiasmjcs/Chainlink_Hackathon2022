import React, { useContext } from 'react'
import './welcome.css'
import Button from '../../components/Button/Button'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../../context/userProvider'

const Welcome = () => {

  const { active, setError, setError_, openBox } = useContext(UserContext)

  const validation = () => {
    setError(true)
    setError_('Must be connected to a wallet')
  } 

  return (
    <div className='container'>
      <div className='container__div'>
        <h1>Jobs <br/> Web3</h1>
          {active ?
        <div className='container__button'>
              <NavLink to='/Jobs'>
            <Button text='Search for a Job' />
          </NavLink>
              <NavLink to='/postjobs'>
            <Button text='Post a Job' />
          </NavLink>  
              <NavLink to='/register'>
            <Button text='register as a professional'/>
          </NavLink>
        </div> :
          <div className='container__button-inactive'>
            <h2>Connect the wallet<br/> to start</h2>
            <Button onClick={active ? null : openBox} text='Connect Wallet'/>
          </div>

}  
      </div>
    </div>
  )
}

export default Welcome