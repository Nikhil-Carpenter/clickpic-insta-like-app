import { useRef } from "react";
import { Link , useNavigate} from "react-router-dom";
// import { useEffect ,useState} from "react";
import "../css/Signup.css"
function Signup()
{

    let form = useRef();
    let user = {};
    let navigate = useNavigate();

    function readValue(property,value){
        user[property] = value.toLowerCase();
        console.log(user);
    }
    
    function signUp(){

        fetch("https://clickpic-api.adaptable.app/users/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(user),
        })
        .then(Response => Response.json())
        .then((Data)=>{
            if(Data.success === true){
                form.current.reset();
                navigate("/login")
                console.log(Data);
            }else{
                console.log(Data);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    
    
    return(
        
    <div className="mainPage">
        <div className="signupDetails">

            <img src="./images/Instagram.png" alt=""/>

            <p className="txt">Sign up to see photos and videos from your friends.</p>
            <form className="signup_form" ref ={form}>
                <input onChange={(event)=>{
                    readValue("email",(event.target.value).toLowerCase())
                }} className="input_box" type="text" placeholder="Email"/>

                <input onChange={(event)=>{
                    readValue("name",(event.target.value).toLowerCase())
                }} className="input_box" type="text" placeholder="Full Name"/>

                <input onChange={(event)=>{
                    readValue("username",(event.target.value).toLowerCase())
                }} className="input_box" type="text" placeholder="Username"/>

                <input onChange={(event)=>{
                    readValue("password",(event.target.value).toLowerCase())
                }} className="input_box" type="text" placeholder="Password"/>

                <p className="end-txt">People who use our service may have uploaded your contact information to Instagram. 
                    <span>Learn More</span> 
                </p>

                <p className="end-txt">By signing up, you agree to our <span>Terms , Data Policy and Cookies Policy</span></p>

                <button type="button" onClick={signUp} className="btn">Sign up</button>
            </form>
        </div>
        <div className="loginLink">
            Have an account? <Link to="/login"><span>Login</span></Link> 
        </div>
        <p>Get the app.</p>
        <div className="social_download_signup">
            <div><img src="./images/Appstore.png" alt=""/></div>
            <div><img src="./images/PlayStore.png" alt=""/></div>
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


    )
}

export default Signup;