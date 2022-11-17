import { ethers } from "ethers"
import './Jobs.css'
import React, { useState, useContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import Button from "../../components/Button/Button"
import Abi from '../../utils/jobsWeb3'
import Postulate from "../../components/Postulate/Postulate"
import SeeApplicants from "../../components/seeApplicants/seeApplicants"
import { UserContext } from "../../context/userProvider"

const Jobs = () => {

    useEffect(() => {
        ejecucion()
    },[])

    const {viewapplicants} = useContext(UserContext)

    const [postulate, setpostulate] = useState(false)
    const [seeapplicants, setseeApplicants] = useState(false)

    const openPostulate = () => {
        setpostulate(true)
    }

    const closePostulate = () => {
        setpostulate(false)
    }

    const openseeApplicants = () => {
        setseeApplicants(true)
    }

    const closeseeApplicants = () => {
        setseeApplicants(false)
    }

    const address = "0x508241c6d14C91816c8d91FC1Ce1D4092470bbFc";
    // abi
    const abi = Abi.abi;

    const [transaccion, setTransaccion] = useState([])
    const [transaccionPremium, setTransaccionPremium] = useState([])
    const [jobsfinal, setjobsfinal] = useState([])

    let jobs = []
    let jobsPremium = []
    let jobsFinal = []
    const viewJobs = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    address,
                    abi,
                    signer
                );
                const tx = await contract.returnjobs();
                jobs = [...tx].reverse() 
                setTransaccion(tx)
                console.log(tx)

            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'an error has occurred',
            })
            console.log(error);
        }
    }

    const viewJobsPremium = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    address,
                    abi,
                    signer
                );
                const tx = await contract.returnjobsPremium();
                jobsPremium = [...tx].reverse()
                setTransaccionPremium(tx)
                console.log(tx)

            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'an error has occurred',
            })
            console.log(error);
        }
    }

    const ejecucion = () => {
        viewJobs()
        viewJobsPremium()
        setTimeout(() => {

            jobsFinal = [...jobsPremium, ...jobs]
            console.log(jobsFinal)
            setjobsfinal(jobsFinal)
        }, 1500)

    }

    return (
        <div className="containerJobs">
                        <div className="containerJobs__div">
                        {jobsfinal.map((tx, i) => (
                               <ul key={i} className="containerJobs__ul">

                                   <li className="containerJobs__li"><span>Job title:  </span> <span> {tx.MarketStall}</span> </li>
                                    <li className="containerJobs__li"> <span>Name of the company:  </span><span> {tx.business}</span> </li>
                                   <li className="containerJobs__li"> <span>Country:  </span> <span>{tx.country}</span> </li>
                                   <li className="containerJobs__li--description">  <span>Job description: </span> <span>{tx.description}</span> </li>
                                   <li className="containerJobs__li"> <span>Salary:  </span> <span>{tx.salary.toNumber()}</span> </li>
                                   <li className="containerJobs__li"> <span>vacancies:  </span> <span>{tx.vacancies.toNumber()}</span> </li>
                                <li className="containerJobs__li--id"><span>Job Id:  </span> <span className="containerJobs__span--id">{tx.id}</span> </li>
                                <div className="containerJobs__divButton">
                                <Button onClick={openPostulate} className='containerJobs__button' text='Postulate' />
                                    <Button onClick={()=> {
                                        viewapplicants(tx.id)
                                        openseeApplicants()

                                    
                                }
                                    } className='containerJobs__button' text='See applicants' />
                                    
                                   </div>
                            </ul>))}
                         </div>
            {seeapplicants && <SeeApplicants close={closeseeApplicants}/>}
            {postulate && <Postulate close={closePostulate} />}
        </div>
    )
}

export default Jobs