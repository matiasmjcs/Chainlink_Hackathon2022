import { createContext, useState, useEffect } from 'react'
import Loading2 from '../components/loading2/Loading'
import Abi from '../utils/jobsWeb3'
import { ethers } from 'ethers'

export const UserContext = createContext()

const UserProvider = ({children}) => {

    const address = "0xCF71c02a6e63177f4549e3a15a7d83Ee56E04de9";
    // abi
    const abi = Abi.abi;

    // useState to store connected wallet
    const [currentAccount, setCurrentAccount] = useState("");
    // useState to store status of the connected account 
    const [active, setActive] = useState(false);
    const [card, setCard] = useState(false);
    const [view, setView] = useState('');
    const [box, setBox] = useState(false)
    const [loading, setLoading] = useState(false)
    const [red, setRed] = useState(false)
    const [redState, setRedState] = useState('Switch Network')
    const [conectado, setConectado] = useState(false)
    const [txReverse, setTxReverse] = useState([])
    const [search, setSearch] = useState('')
    const [error, setError] = useState(false)
    const [error_, setError_] = useState('')
    const [success, setSuccess] = useState(false)
    const [success_, setSuccess_] = useState('')
    const [truee, settruee] = useState(false)
    

    let searchJob = []

    let applicants = []
    let Applicants = []
    //BoxMetamask
    const openBox = () => {
        setBox(true)
    }

    const closeBox = () => {
        setBox(false)
    }

    const Switch = async () => {
        try{
            setRedState(<Loading2 />)
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
            });
            setTimeout(() => {
                setRed(true)
            }, 1500)
        }
        catch {
            setRed(false)
            setRedState('Switch Network')
            setError(true)
            setError_('connect to the mumbai chaid network')

        }
      
    }

    // function to loggin with metamask
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            setActive(true);
            setView(<Loading2 />)
            setLoading(true)
            if (!ethereum) {
                console.log("please install MetaMask");
            }
            setTimeout(async ()=> {
                const accounts = await ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setConectado(true)
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                const mumbaiChainId = '0x13881'
                if (chainId === mumbaiChainId) {
                    setRed(true)
                } else {
                    setTimeout(() => {
                        setRed(false)
                    }, 1500)
                    setRedState('Switch Network')
                }
                setTimeout(() => {
                    setCurrentAccount(accounts[0]);
                    setView(accounts[0])
                }, 800);
                setBox(false)
                setLoading(false)
                setView(currentAccount)
            },1000)
            
        } catch (error) {
            console.log(error);
            setView('connect Wallet')
            setLoading(false)
            setActive(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'the wallet has not been connected',
            })
        }
    }

    const Disconnet = () => {
        setActive(false)
        setCard(false)
        setRed(true)
    }

    const openCard = () => {
        card ? setCard(false) : setCard(true)
    }

    const closeCard = () => {
        setCard(false)
    }

    const viewapplicants = async (_Id) => {
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
                const tx = await contract.returnpostulant(_Id);
                 applicants = [...tx].reverse()
                const viewapplicant = async (_aplicant) => {
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
                            const tx = await contract.seeProfesionales(_aplicant);
                            Applicants.push(tx)
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
                applicants.map(tx => {
                    viewapplicant(tx)
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

    useEffect(() => {
        ejecucion()
    }, [search])

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
            setjobsfinal(jobsFinal)
        }, 1500)

    }

    if (!search >= 1) {
        searchJob = jobsfinal
    } else {
        searchJob = jobsfinal.filter(job => {
            const jobTitle = job.MarketStall.toLowerCase()
            const jobSearch = search.toLowerCase()
            return jobTitle.includes(jobSearch)
        })
    }

    const Postulate = async (_id) => {
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
                const tx = await contract.postulate(_id);
                await tx.wait();
                settruee(false)
                setSuccess(true)
                setSuccess_('You have successfully applied for the job')

            }
        } catch (error) {
            setError(true)
            settruee(false)
            setError_('An error occurred while trying to apply')
            console.log(error);
        }
    }

    return (
        <UserContext.Provider 
            value={{ 
                currentAccount,
                active, 
                view, 
                connectWallet, 
                Disconnet, 
                openCard, 
                closeCard, 
                card, 
                box, 
                openBox, 
                closeBox, 
                loading, 
                red,
                Switch,
                redState,
                conectado,
                viewapplicants,
                applicants,
                Applicants,
                setTxReverse,
                txReverse,
                jobsfinal,
                searchJob,
                search,
                setSearch,
                Postulate,
                ejecucion,
                error,
                setError,
                setError_,
                error_,
                success,
                setSuccess,
                success_,
                setSuccess_,
                truee
            }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider