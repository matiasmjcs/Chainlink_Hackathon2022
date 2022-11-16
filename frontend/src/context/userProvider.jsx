import { createContext, useState } from 'react'
import Swal from 'sweetalert2'
import Loading from '../components/Loading/Loading'
import Abi from '../utils/jobsWeb3'
import { ethers } from 'ethers'

export const UserContext = createContext()

const UserProvider = ({children}) => {

    const address = "0xa91D8DA6CF00BE77Fd39BA43D10D504c80aAa52D";
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
            setRedState(<Loading />)
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: ' connect to the binance smart chain network',
            })

        }
      
    }

    // function to loggin with metamask
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            setActive(true);
            setView(<Loading />)
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
                const binanceTestChainId = '0x13881'
                if (chainId === binanceTestChainId) {
                    setRed(true)
                } else {
                    setTimeout(() => {
                        setRed(false)
                    }, 1500)
                    setRedState('Switch Network')


                }

                setTimeout(() => {
                    setCurrentAccount(accounts[0]);
                    setView('view user')
                }, 800);
                setBox(false)
                setLoading(false)
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
                console.log(applicants)
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
                            console.log(tx)
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

                console.log(Applicants)

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
            }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider