import { Outlet } from "react-router-dom"
import Nav from "../components/nav/nav"
import Footer from "../components/footer/Footer"

const LayoutPublic = () => {
    return(
        <>
        <Nav/>
        <Outlet/>
        <Footer/>
        </>
    )
}

export default LayoutPublic