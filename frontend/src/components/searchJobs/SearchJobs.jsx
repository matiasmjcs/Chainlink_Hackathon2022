import Input from '../input/Input.jsx'
import {useContext} from 'react'
import { UserContext } from '../../context/userProvider.jsx'
import './SearchJobs.css'
const SearchJobs = () => {

    const {search, setSearch} = useContext(UserContext)

    const handleChange = (e) => {
        setSearch(e.target.value)
    }


    return (
        <form className='searchForm'>
            <Input placeholder='Search Jobs' type='text' value={search} onChange={handleChange}/>
        </form>
    )
}

export default SearchJobs