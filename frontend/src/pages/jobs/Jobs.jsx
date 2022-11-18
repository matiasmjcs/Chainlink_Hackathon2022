import './Jobs.css'
import React, { useState, useContext, useEffect } from 'react'
import Button from "../../components/Button/Button"
import SeeApplicants from "../../components/seeApplicants/seeApplicants"
import { UserContext } from "../../context/userProvider"
import SearchJobs from "../../components/searchJobs/SearchJobs"
import Error from '../../components/error/Error'
import Success from "../../components/success/Seccess"
import Loading from '../../components/Loading/Loading'


const Jobs = () => {
    

    useEffect(() => {
            ejecucion()
    }, [])
    

    const [seeapplicants, setseeApplicants] = useState(false)
    


    const { viewapplicants, searchJob, Postulate, ejecucion, error, success, truee, active, setError_, setError } = useContext(UserContext)

    
    const openseeApplicants = () => {
        setseeApplicants(true)
    }
    
    const closeseeApplicants = () => {
        setseeApplicants(false)
    }
    const verificar = () => {
        setError(true)
        setError_('you need to have a connected wallet')
    }

    return (
        <div className="containerJobs">
            {truee ? <Loading/>:
            <>
                            <SearchJobs/>
                        <div className="containerJobs__div">
                        {searchJob.map((tx, i) => (
                               <ul key={i} className="containerJobs__ul">
                                   <li className="containerJobs__li--description">  <b>Job description: </b> <span>{tx.description}</span> </li>
                                <div className="containerJobs__lidiv">

                                   <li className="containerJobs__li"><b>Job title:  </b> <span> {tx.MarketStall}</span> </li>
                                    <li className="containerJobs__li"> <b>Name of the company:  </b><span> {tx.business}</span> </li>
                                   <li className="containerJobs__li"> <b>Country:  </b> <span>{tx.country}</span> </li>
                                   <li className="containerJobs__li"> <b>Salary:  </b> <span>{tx.salary.toNumber()}</span> </li>
                                   <li className="containerJobs__li"> <b>vacancies:  </b> <span>{tx.vacancies.toNumber()}</span> </li>
                                <li className="containerJobs__li--id"><b>Job Id:  </b> <span className="containerJobs__span--id">{tx.id}</span> </li>
                                   
                                <div className="containerJobs__divButton">
                                    <Button onClick={() => {
                                        if(!active){
                                            return (verificar())
                                        }
                                        Postulate(tx.id)
                                        window.scroll({top: 0, behavior: 'smooth'})
                                        

                                    }
                                    }
                                    
                                    className='containerJobs__button' text='Postulate' />
                                    <Button onClick={()=> {
                                            if (!active) {
                                                return (verificar())
                                            }
                                        viewapplicants(tx.id)
                                        openseeApplicants()

                                    
                                }
                                    } className='containerJobs__button' text='See applicants' />
                                    
                                   </div>
                                </div>
                                    
                            </ul>))}
                         </div>
                         </>}
            {seeapplicants && <SeeApplicants close={closeseeApplicants}/>}
            {error && <Error  />}
            {success && <Success  />}
        </div>
    )
}

export default Jobs