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
    


    const { viewapplicants, searchJob, Postulate, ejecucion, error, success, truee } = useContext(UserContext)

    
    const openseeApplicants = () => {
        setseeApplicants(true)
    }
    
    const closeseeApplicants = () => {
        setseeApplicants(false)
    }

    return (
        <div className="containerJobs">
            {truee ? <Loading/>:
            <>
                            <SearchJobs/>
                        <div className="containerJobs__div">
                        {searchJob.map((tx, i) => (
                               <ul key={i} className="containerJobs__ul">
                                   <li className="containerJobs__li"><span>Job title:  </span> <span> {tx.MarketStall}</span> </li>
                                    <li className="containerJobs__li"> <span>Name of the company:  </span><span> {tx.business}</span> </li>
                                   <li className="containerJobs__li"> <span>Country:  </span> <span>{tx.country}</span> </li>
                                   <li className="containerJobs__li--description">  <span>Job description: </span> <span>{tx.description}</span> </li>
                                   <li className="containerJobs__li"> <span>Salary:  </span> <span>{tx.salary.toNumber()}</span> </li>
                                   <li className="containerJobs__li"> <span>vacancies:  </span> <span>{tx.vacancies.toNumber()}</span> </li>
                                <li className="containerJobs__li--id"><span>Job Id:  </span> <span className="containerJobs__span--id">{tx.id}</span> </li>
                                <div className="containerJobs__divButton">
                                    <Button onClick={() => {
                                        Postulate(tx.id)


                                    }
                                    }
                                    
                                    className='containerJobs__button' text='Postulate' />
                                    <Button onClick={()=> {
                                        viewapplicants(tx.id)
                                        openseeApplicants()

                                    
                                }
                                    } className='containerJobs__button' text='See applicants' />
                                    
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