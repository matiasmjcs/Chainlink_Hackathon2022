import Button from "../../components/Button/Button"
import Input from "../../components/input/Input"
import { useState, useContext } from 'react'
import './PostJobs.css'
import Check from "../../components/Check/Check"
import { ethers } from "ethers"
import Abi from '../../utils/jobsWeb3'
import Loading from '../../components/Loading/Loading'
import { UserContext } from "../../context/userProvider"
import Error from "../../components/error/Error"
import Success from "../../components/success/Seccess"


const PostJobs = () => {

    const { error, setError, setError_, success, setSuccess, setSuccess_, active} = useContext(UserContext)

    const address = "0x7910A8643dCCfbBAC635d202dE6F5dDFFA3925A2";
    // abi
    const abi = Abi.abi;

    const [truee, settruee] = useState(false)



    const initialState = {
        marketstal: '',
        business: '',
        country: '',
        description: '',
        vacancies: 0,
        salary: 0,
        contact: '',
        checkbox: false
    }

    const [input, setInput] = useState(initialState)

    const handleChange = (e) => {
        const {name, type, value, checked } = e.target

        setInput({
            ...input,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const postJobs = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                settruee(true)
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    address,
                    abi,
                    signer
                );
                const tx = await contract.postWork(input.marketstal, input.business, input.country, input.description, input.vacancies, input.salary, input.contact);
                await tx.wait();
                settruee(false)
                setInput(initialState)
                setSuccess(true)
                setSuccess_('the work has been published successfully')
              
            }
        } catch (error) {
            setError(true)
            setError_('An error occurred while posting the job')
            settruee(false)
            console.log(error);
        }
    }

    const postJobsPremium = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                settruee(true)
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    address,
                    abi,
                    signer
                );
                const tx = await contract.postWorkPremium(input.marketstal, input.business, input.country, input.description, input.vacancies, input.salary, input.contact, { value: ethers.utils.parseEther("0.2") });
                await tx.wait();
                settruee(false)
                setInput(initialState)
                setSuccess(true)
                setSuccess_('the work has been published successfully')
            }
        } catch (error) {
            setError(true)
            setError_('an error occurred while publishing the premium work')
            settruee(false)
            console.log(error);
        }
    }

    const aprobado = (response) => {
        setError(true)
        setError_(response)
    }
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!active) {
            return aprobado('Must be connected to a wallet')
        }
        if (!input.marketstal.trim() || !input.business.trim() || !input.country.trim() || !input.description.trim() || !input.contact.trim() ){
            return aprobado('All fields are required')
        }
        if (input.vacancies === 0 || input.salary === 0){
            return aprobado('All fields are required')
        }
        if (!emailRegex.test(input.contact)){
            return aprobado('Enter a valid email format')
        }
        if (input.checkbox === false) {
            postJobs() 
            return
        } if (input.checkbox === true){
            postJobsPremium()
        }

    }

    return (
        <div className="container-jobsPost">
            {truee ? <Loading/> :
            <>
            <form onSubmit={handleSubmit} className="form">
                <h1>Post Jobs</h1>
                <div className="container-input">
                    <Input placeholder='market stal' onChange={handleChange} value={input.marketstal} name='marketstal' type='text' />
                    <Input placeholder='business' onChange={handleChange} value={input.business} name='business' type='text' />
                    <Input placeholder='country' onChange={handleChange} value={input.country} name='country' type='text' />
                    <textarea placeholder='description' onChange={handleChange} value={input.description} name='description' />
                    <Input placeholder='vacancies' onChange={handleChange} value={input.vacancies} name='vacancies' type='number' />
                    <Input placeholder='salary' onChange={handleChange} value={input.salary} name='salary' type='number' />
                    <Input placeholder='contact' onChange={handleChange} value={input.contact} name='contact' type='text' />
                            <div className="container-input2">
                        <Check name='checkbox' type='checkbox' onChange={handleChange} checked={input.checkbox}/>
                                <span className="container-span">post premium work worth 0.2 matic (premium work will appear <br/>
                                    first and will be removed every Sunday)</span>
                    </div>
                </div> 
                <div className="container-button">
                            <Button text='post'/>
                </div>
            </form>
            </>}
            {error && <Error /> }
            {success && <Success/>}
        </div>
    )
}

export default PostJobs