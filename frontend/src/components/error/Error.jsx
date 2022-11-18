import ReactDOM from 'react-dom'
import {useContext} from 'react'
import { UserContext } from '../../context/userProvider'
import './Error.css'
import img from './error.png'
import Button from '../Button/Button'


const Error = () => {

    const {  setError, error_ } = useContext(UserContext)


    return ReactDOM.createPortal(
        <div className='boxError'>
            <div className='boxError__div'>
                <div className='container-imgError'>
                    <img src={img} />
                </div>
                <p>{error_}</p>
                <Button onClick={() => setError(false)} text='Accept'/>
            </div>
        </div>,
        document.getElementById('error')
    )
}

export default Error