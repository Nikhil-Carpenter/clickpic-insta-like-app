// import React from 'react'
import "../css/Createpost.css"
import Header from '../components/Header';
import { useRef } from "react";

const Createpost = () => {

    let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")))
    let post = new FormData();
    let form = useRef({});
    console.log(form)

    post.append("user",loginDetails.current.userId)

    console.log(loginDetails);

    function readValue(property,value){
        post.append(property,value);
    }

    function createpost(){
        // console.log(post);

        fetch(`http://localhost:8000/posts/create`,{
            method:"POST",
            headers:{
               "authorization":`Bearer ${loginDetails.current.token}` 
            },
            body:post
        })
        .then((responseData)=> responseData.json())
        .then((data)=>{
            console.log(data)

            form.current.reset();
        })
        .catch((err)=>{
            console.log(err)
        })
    }

  return (
    <>
    <Header/>
        <div  className="create-form">

            <form ref={form} className="create-post">

                <div>
                    <h2>Select Files</h2>
                    <input type="file" multiple className="file-inp" 
                    onChange={(event)=>{
                        readValue("contents",event.target.files[0])
                    }} />
                </div>

                <input  type="text"className="cr-inp" placeholder="Caption"
                onChange={(event)=>{
                    readValue("caption",(event.target.value).toLowerCase())
                }} />
                <input  type="text"className="cr-inp" placeholder="Location"
                onChange={(event)=>{
                    readValue("location",(event.target.value).toLowerCase())
                }}  />

                <button type="button" className="cr_btn" onClick={createpost}>Create</button>

            </form>
            
        </div>    
    </>
    
   
  )
}

export default Createpost;