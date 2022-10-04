import { useEffect,useRef,useState  } from "react";
import io from "socket.io-client";
import Header from "../components/Header";
import "../css/Chat.css";

const socket  = io.connect("https://clickpic-api.adaptable.app/");

function Chat(){

    let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")));
    let [chatlist,setChatList] = useState([]);
    let [chats,setChats] = useState([])
    let chatBox = useRef()
    let chat = useRef({});
    let inp = useRef();
    let lastdate = useRef(null);

    let [currentPerson,setCurrentPerson] = useState(null);

    useEffect(()=>{

        // Sending message o socket to create a channel for loggedin user
        socket.emit("create_channel",loginDetails.current.userId)

        fetch(`https://clickpic-api.adaptable.app/chats/chatlist/${loginDetails.current.userId}`,{
            headers: {
                authorization: `Bearer ${loginDetails.current.token}`,
            },
        })
        .then(res=>res.json())
        .then((data)=>{
            // console.log(data.user.chatList)
            if (data.success) {
                setChatList(data.user.chatList)
            }
        })
        .catch((err)=>{
            console.log(err)
        })


    },[])

    function readValue(property,value){
        chat.current[property] = value;
    }

    function sendChatMessage(){

        chat.current["sender"] = loginDetails.current.userId;
        chat.current["receiver"] = currentPerson._id;

        socket.emit("send_message",chat.current)
        inp.current.value = "";
       
    }
    
    useEffect(()=>{

        socket.on("load_chat",(chats)=>{
            console.log(chats)
            setChats(chats)
        })

    },[])

    function getInitialChats(){

        fetch(`https://clickpic-api.adaptable.app/chats/chats/${loginDetails.current.userId}/${currentPerson?._id}`,{
            headers:{
                authorization: `Bearer ${loginDetails.current.token}`,
            }
        })
        .then(res=>res.json())
        .then((data)=>{
            if (data.success) {
                console.log(data)
                setChats(data.chats)
                lastdate.current = null;
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{

        // console.log(currentPerson)

        if (currentPerson!==null) {
            getInitialChats()
        }

    },[currentPerson])

    useEffect(()=>{
        chatBox.current?.scrollIntoView();
    },[chats])

    return(
        <>
        <Header />
        {/* <!-- chat section  --> */}

    <section className="chat_main">
        <section className="chats">

            <div className="chats_container">

                <div className="username_logged_in">
                    <div>
                        <p>{loginDetails.current.username}</p>
                        <i className="bi bi-chevron-down"></i>
                    </div>
                    {/* <i className="fa-solid fa-pen-to-square"></i> */}
                </div>

                <div className="chat_users">

                    <div className="title">
                        <p>Messages</p>
                        {/* <span>1 Request</span> */}
                    </div>

                    <div className="users_container">

                        {
                            chatlist.map((chatuser,idx)=>{
                                
                                const userName = chatuser.username.length>10?chatuser.username.slice(0,10)+"..":chatuser.username;
                                
                                return(

                                    <div onClick={()=>{
                                        setCurrentPerson(chatuser)
                                        getInitialChats()
                                    }} key={idx} className={chatuser?._id === currentPerson?._id ? "user_chatable currentperson":"user_chatable"}>

                                        <div className="profile_photo">
                                            <img src={chatuser.profilePic} alt="userimg"/>
                                        </div>
                                        <div className="message_content">
                                            <p>{userName}</p>
                                            <span>
                                                Hi, there!
                                                <span>·</span>
                                                <span>4d</span>
                                            </span>
                                        </div>
                    
                                    </div>
                                )
                            })
                        }

                        

                    </div>

                    

                </div>

            </div>
            
            <div className="message_container">

                {
                    currentPerson===null?(
                        <div className="default_message">
                            <div className="send_icon">
                                <i className="bi bi-send"></i>
                            </div>
                            
                            <div className="info">
                                <span>Your Messages</span>
                                <span>Send private photos and messages to a friend or group.</span>
                            </div>

                            <button>Send Message</button>
                        </div>
                    ):(
                        <div className="chat-area">
                            <div  className="chat-box">
                                {
                                    chats.map((chat,idx)=>{

                                        let date = new Date(chat.createdAt)
                                        
                                        let dateString='';

                                        if(lastdate.current?.getDate()!==date.getDate() || lastdate.current.getDate() === null){
                                            dateString= date.toDateString();
                                            lastdate.current = date;
                                        }


                                        return (
                                        <>
                                           
                                        <p className="groupdate">{dateString}</p>
                                          
                                                <div ref={chatBox} className={loginDetails.current.userId===chat.sender?"chat-message alignright":"chat-message"} key={idx} >
                                               
                                                <p>{chat.message}</p>
                                                <p className="time">{date.getHours()}:{date.getMinutes()}</p>
                                            </div>
                                        </>
                                        )
                                    })
                                }

                            </div>
                            <div className="message-box">
                                <input ref={inp} onChange={(event)=>{
                                    readValue("message",event.target.value)
                                }} type="text" />
                                <button onClick={()=>{
                                    sendChatMessage()
                                }} className="send-btn">
                                <i className="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    )
                }

                

            </div>

        </section>
    </section>

    

 

</>

    )
}

export default Chat;