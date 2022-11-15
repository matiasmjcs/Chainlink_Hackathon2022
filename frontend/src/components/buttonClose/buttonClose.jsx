import './buttonClose.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkSquare } from '@fortawesome/free-solid-svg-icons'

const ButtonClose = ({close, className}) => {
    return (
        <div className={`container-icon ${className}`} onClick={close}><FontAwesomeIcon className='icon' icon={faXmarkSquare}/></div>
    )
}

export default ButtonClose