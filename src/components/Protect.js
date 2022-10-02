import { Navigate } from "react-router-dom"

const Protect = (props) => {

    let loggedin = localStorage.getItem("login_details")
    return loggedin !== null ? props.children :<Navigate to="/login"/> 
}

export default Protect;