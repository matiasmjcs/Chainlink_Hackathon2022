import Button from "../../components/Button/Button"
import Input from "../../components/input/Input"
import { useState } from 'react'
import './PostJobs.css'
import Check from "../../components/Check/Check"
import Swal from 'sweetalert2'
import { ethers } from "ethers"
import Abi from '../../utils/jobsWeb3'


const PostJobs = () => {

    const address = "0x508241c6d14C91816c8d91FC1Ce1D4092470bbFc";
    // abi
    const abi = Abi.abi;


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
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    address,
                    abi,
                    signer
                );
                const tx = await contract.postWork(input.marketstal, input.business, input.country, input.description, input.vacancies, input.salary, input.contact);
                await tx.wait();
                setInput(initialState)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `Hash Transactions: ${tx.hash}`,
                    showConfirmButton: true
                })
              
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

    const postJobsPremium = async () => {
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
                const tx = await contract.postWorkPremium(input.marketstal, input.business, input.country, input.description, input.vacancies, input.salary, input.contact);
                await tx.wait();
                setInput(initialState)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `Hash Transactions: ${tx.hash}`,
                    showConfirmButton: true
                })
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

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(typeof Number(input.salary))

        if (input.checkbox === false) {
            postJobs() 
            return
        } if (input.checkbox === true){
            postJobsPremium()
        }

    }

    return (
        <div className="container-jobsPost">
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
                    <Check name='checkbox' type='checkbox' onChange={handleChange} checked={input.checkbox}/>
                </div> 
                <div className="container-button">
                    <Button text='Submit'/>
                </div>
            </form>
        </div>
    )
}

export default PostJobs