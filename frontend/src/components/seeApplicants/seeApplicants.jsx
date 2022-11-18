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
                                    <li><b>Name: </b> {item.name}</li>
                                    <li><b>Last Name: </b> {item.surname}</li>
                                    <li><b>Email: </b> {item.email}</li>
                                    <li><b>linkedin: </b> {item.linkedin}</li>
                                    <li><b>Portfolio: </b> {item.portfolio}</li>
                                </div>
                              
                                <li className='SeeApplicantsContainer__li--presentation'><b>Presentation Letter: </b> {item.presentationLetter}</li>
                            </ul>
                        )).reverse())} 

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