import Input from "../../components/input/Input"
import { useState, useContext } from 'react'
import './Register.css'
import Button from "../../components/Button/Button"
import { ethers } from "ethers"
import Abi from '../../utils/jobsWeb3'
import Loading from '../../components/Loading/Loading'
import { UserContext } from "../../context/userProvider"
import Error from '../../components/error/Error'
import Success from "../../components/success/Seccess"

const Register = () => {

    const { error, setError, setError_ , success, setSuccess, setSuccess_} = useContext(UserContext)

    const address = "0xCF71c02a6e63177f4549e3a15a7d83Ee56E04de9";
    // abi
    const abi = Abi.abi;


    const initialState = {
        name: '',
        lastname: '',
        presentation: '',
        email: '',
        portfolio: '',
        linkedin: ''
    }

    const [truee, settruee] = useState(false)

    const [input, setInput] = useState(initialState)

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const register = async (e) => {
        e.preventDefault()
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
                const tx = await contract.registerProfesional(input.name, input.lastname, input.presentation, input.email, input.portfolio, input.linkedin);
                await tx.wait();
                settruee(false)
                setInput(initialState)
                setSuccess(true)
                setSuccess_('you have registered successfully')

            }
        } catch (error) {
            setError(true)
            settruee(false)
            setError_('an error occurred in the registration')
            console.log(error);
        }
    }


    return (
        <div className="container-register">
            {truee ? <Loading/> : 
            <>
            <form onSubmit={register} className="form">
                <h1>Register</h1>
                <div className="container-input">
                    <Input placeholder='name' onChange={handleChange} value={input.name} name='name' type='text' />
                    <Input placeholder='lastname' onChange={handleChange} value={input.lastname} name='lastname' type='text' />
                    <textarea placeholder='presentation' onChange={handleChange} value={input.presentation} name='presentation' type='text' />
                    <Input placeholder='email' onChange={handleChange} value={input.email} name='email' type='text' />
                    <Input placeholder='portfolio' onChange={handleChange} value={input.portfolio} name='portfolio' type='text' />
                    <Input placeholder='linkedin' onChange={handleChange} value={input.linkedin} name='linkedin' type='text' />
                </div>
                <div className="container-button">
                    <Button text='register'/>
                </div>
            </form>
            </>}

            {error && <Error />}
            {success && <Success />}
        </div>
    )
}

export default Register