import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './seeApplicants.css'
import ButtonClose from '../buttonClose/buttonClose'
import { UserContext } from '../../context/userProvider'
import Loading from '../Loading/Loading' 

const SeeApplicants = ({close}) => {

    let { Applicants } = useContext(UserContext)
    const [aplicants, setaplicants] = useState(false)

    useEffect(() => {
        console.log(Applicants)
    }, [Applicants])

    setTimeout(() => {
        setaplicants(true)
    }, 1000)

    return ReactDOM.createPortal(
        <div className='SeeApplicantsContainer'>
            <div className='SeeApplicantsContainer__div'>


                {
                    !aplicants ? <Loading/> :
                        (Applicants.map((item) => (
                            <ul className='SeeApplicantsContainer__ul'>
                                <div className='SeeApplicantsContainer__li'>
                                    <li><stron>Name: </stron> {item.name}</li>
                                    <li><stron>Last Name: </stron> {item.surname}</li>
                                    <li><stron>Email: </stron> {item.email}</li>
                                    <li><stron>linkedin: </stron> {item.linkedin}</li>
                                    <li><stron>Portfolio: </stron> {item.portfolio}</li>
                                </div>
                              
                                <li className='SeeApplicantsContainer__li--presentation'><stron>Presentation Letter: </stron> {item.presentationLetter}</li>
                            </ul>
                        )))} 

                <ButtonClose close={()=>{
                    close()
                    Applicants.splice(0, Applicants.length)
                    }} />
            </div>
        </div>
        ,
        document.getElementById('seeApplicants'))
}

export default SeeApplicants