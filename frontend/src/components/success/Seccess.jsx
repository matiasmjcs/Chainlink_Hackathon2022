import ReactDOM from 'react-dom'
import { useContext } from 'react'
import { UserContext } from '../../context/userProvider'
import img from './success.png'
import Button from '../Button/Button'

const Success = () => {

    const {success_, setSuccess} = useContext(UserContext)
    return ReactDOM.createPortal(
        <div className='boxError'>
            <div className='boxError__div'>
                <div className='container-imgError'>
                    <img src={img} />
                </div>
                <p>{success_}</p>
                <Button onClick={() => setSuccess(false)} text='Accept' />
            </div>
        </div>,
        document.getElementById('success')
    )
}

export default Success