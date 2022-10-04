import React, { useState,useRef,useEffect } from 'react'
import Header from '../components/Header'
import "../css/Explore.css"

const Explore = () => {

  let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")));

  const [posts,setPosts] = useState([]);

  useEffect(()=>{
    fetch(`https://clickpic-api.adaptable.app/users/posts/explore/random/${loginDetails.current.userId}`,{
      headers:{
        "authorization": `Bearer ${loginDetails.current.token}`,
    }
    })
    .then(response=>response.json())
    .then((data)=>{
      console.log(data)
      console.log(data.posts)

      if (data.success === true) {
        setPosts(data.posts)
      }


    })
    .catch((err)=>{
      console.log(err)
    })
  },[])




  return (
    <>
    <Header/>
    <h1>Explore</h1>
    

    {/* <div className='exploreSection'>

    {
      posts?.map((post,idx)=>{
        return(
          <div key={idx} className='exCard'>
            <img src={post.contents[0]} alt="post img" />
            <p>{post.caption}</p>
            <div>{post.user.name}</div>
          </div>
        )
      })
    }
    </div> */}

    
      <div className="explore_section">
        <div className="exPosts">
                  {
                    posts.map((post,idx)=>{
                        return(
                          <div  className="post_thumb" key={idx}>
                                {
                          post.fileType==="VIDEO"?(
                            <video className="post-image" src={post.contents[0]} autoPlay muted loop></video>
                          ):(

                            <img src={post.contents[0]} alt="posts of users" />
                          )
                        }
                            <div className="overlay">
                              <span><i className="fa-solid fa-heart"></i>{ post.likes?.length}</span>
                              <span><i className="fa-solid fa-comment"></i>{ post.commentCount}</span>
        
                            </div>
                          </div>
                        )
                    })
                  }
            </div>
      </div>
    </>
  )
}

export default Explore;