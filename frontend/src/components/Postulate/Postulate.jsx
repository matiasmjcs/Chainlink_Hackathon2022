import ReactDOM from 'react-dom'
import './Postulate.css'
import ButtonClose from '../buttonClose/buttonClose'

const Postulate = ({close}) => {



    return ReactDOM.createPortal(
    <div className='postulateContainer'>
            <div className='postulateContainer__div'>

                <ButtonClose close={close} />
            </div>
    </div>,

        document.getElementById('Postulate')
)
}

export default Postulate