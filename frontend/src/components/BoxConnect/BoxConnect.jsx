import React from 'react'
import ReactDOM from 'react-dom'
import './BoxConnect.css'
import { Metamask } from '@web3uikit/icons';
import ButtonClose from '../buttonClose/buttonClose'
import Loading from '../Loading/Loading'
import { useContext } from 'react'
import { UserContext } from '../../context/userProvider'

const BoxConnect = ({close}) => {

    const { connectWallet, loading, closeBox } = useContext(UserContext)

  return ReactDOM.createPortal(
      <div className='BoxConnect'>
          <div className='BoxConnect__div'>
              {loading ? <Loading className='BoxConnect__loading'/> :
            <>
              <button onClick={connectWallet} className='BoxConnect__button'>
                  <Metamask className='BoxConnect__metamask' />
              </button>
              <strong className='BoxConnect__text'>MetaMask</strong> 
                      <ButtonClose close={closeBox} />
              </>}
          </div>
      </div>,
      document.getElementById('boxMetamask')
  )
}

export default BoxConnect