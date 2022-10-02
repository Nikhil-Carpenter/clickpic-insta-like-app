import { Link , useNavigate } from "react-router-dom";
import "../css/Login.css";
function Login(){

    let userCred = {};
    let navigate = useNavigate();

    function readValue(property,value){
        userCred[property] = value;
        console.log(userCred);
    }

    function login(){

        fetch("http://localhost:8000/users/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(userCred),
        })
        .then((Response)=>Response.json())
        .then((userData)=>{
            if(userData.success === true){
                // console.log(userData);
                localStorage.setItem("login_details",JSON.stringify(userData))
                navigate("/homepage")
            }else{
                console.log(userData);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }


    return(
        <>
            <div className="login_body">
                <div className="main_container">
                    <div className="phone_container">
                        <img src="./images/phone.png" alt=""/>
                    </div>
                    <div className="form_container">
                        <div className="login_details">
                            <h1 className="logo"><img src="./images/Instagram.png" alt=""/></h1>
                            <input onChange={(event)=>{
                                readValue("email_username",(event.target.value).toLowerCase())
                            }} className="input_box_login" type="text" placeholder="Username or Email"/>
                            <input onChange={(event)=>{
                                readValue("password",(event.target.value).toLowerCase())
                            }} className="input_box_login" type="password" placeholder="Password"/>
                            <button onClick={login} className="login_btn">Log In</button>
                
                            <div className="facebook_login">
                                <i className="fa-brands fa-facebook-square"></i>
                                <p>Log in with Facebook</p>
                            </div>
                            <p>Forgot password?</p>
                        </div>
                        <div className="sign_up">
                            Don't have an account? <Link to="/signup"><span>Sign up</span></Link>
                        </div>
                        <p>Get the app.</p>
                        <div className="social_download">
                            <div><img src="./images/Appstore.png" alt=""/></div>
                            <div><img src="./images/PlayStore.png" alt=""/></div>
                        </div>
                    </div>
                    </div>
                    <div className="other_details">
                        <ul>
                            <li>Meta</li>
                            <li>About</li>
                            <li>Blog</li>
                            <li>Jobs</li>
                            <li>Help</li>
                            <li>API</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                            <li>Top Accounts</li>
                            <li>Hashtags</li>
                            <li>Locations</li>
                            <li>Instagram Lite</li>
                            <li>Dance</li>
                            <li>Food & Drink</li>
                            <li>Home & Garden</li>
                            <li>Music</li>
                            <li>Visual Arts</li>
                        </ul>
                    </div>
            </div>

        </>
    )
}

export default Login;