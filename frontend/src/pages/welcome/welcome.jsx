import React, { useContext } from 'react'
import './welcome.css'
import Button from '../../components/Button/Button'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../../context/userProvider'
import Error from '../../components/error/Error'

const Welcome = () => {

  const { active, openBox, error, connect } = useContext(UserContext)


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
      {(error && connect) && <Error/>}
    </div>
  )
}

export default Welcome