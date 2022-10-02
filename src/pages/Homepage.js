import "../css/Homepage.css";
import Header from "../components/Header";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Homepage() {

  let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")));
  let [allPosts, setAllPosts] = useState([]);
  let [postModalVisible, setPostModalVisible] = useState(false);
  let form = useRef({});
  let [inpComment,setInpComment] = useState()
  let likeSingle = useRef(null);

  let [singlePost, setSinglePost] = useState({});
  let [requests, setRequests] = useState([]);

  let commentMsg = {
    user: loginDetails.current.userId,
  };

  useEffect(() => {
    fetch(`http://localhost:8000/users/posts/${loginDetails.current.userId}`, {
      headers: {
        authorization: `Bearer ${loginDetails.current.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          setAllPosts(data.posts);
          // console.log(data.posts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function like(postId) {
    fetch("http://localhost:8000/posts/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${loginDetails.current.token}`,
      },
      body: JSON.stringify({ post: postId, user: loginDetails.current.userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        if (data.success === true) {
          let tempPosts = [...allPosts];
          let post = tempPosts.find((post, idx) => {
            return post._id === postId;
          });

          post.likes.push(data.like);
          setAllPosts(tempPosts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function unlikePost(likeId, postId) {
    fetch(`http://localhost:8000/posts/unlike/${likeId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${loginDetails.current.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          let tempPosts = [...allPosts];
          let post = tempPosts.find((post, idx) => {
            return post._id === postId;
          });
          let likeIndex = post.likes.findIndex((like, idx) => {
            return like.user === loginDetails.current.userId;
          });
          // console.log(likeIndex);

          post.likes.splice(likeIndex, 1);
          setAllPosts(tempPosts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function comment(postId,where) {
    commentMsg["post"] = postId;
    // console.log(post)

    fetch("http://localhost:8000/posts/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${loginDetails.current.token}`,
      },
      body: JSON.stringify(commentMsg),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.comment)
        if (data.success === true) {

          if(where==="limited"){

            let tempPosts = [...allPosts]
            let post = tempPosts.find((post, idx) => {
              return post._id === postId;
            });
  
            post.comments.push(data.comment)
            post.commentCount +=1;
            setAllPosts(tempPosts);

          }else
          {
            let post = {...singlePost};
            post.comments.unshift(data.comment);
            setSinglePost(post)
          }
          setInpComment('')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteComment(commentId,post) {

    fetch(`http://localhost:8000/posts/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${loginDetails.current.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          // console.log(allPosts)

          let tempPost = {...post};
          let commentIndex = tempPost.comments.findIndex((comm, idx) => {
            return comm._id === commentId;
          });
          // console.log(commentIndex);

          tempPost.comments.splice(commentIndex, 1);
          setSinglePost(tempPost)

          let tempPosts = [...allPosts]
          let tempPost2 = tempPosts.find((post,idx)=>{
            return post._id===tempPost._id;
          })
          // console.log(tempPost2);

          let secondCommIdx = tempPost2.comments.findIndex((comm,idx)=>{
            return comm._id === commentId;
          })

          tempPost2.comments.splice(secondCommIdx, 1);
          tempPost2.commentCount -=1;
          setAllPosts(tempPosts);

        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function timeDifference(date1, date2) {
    let difference = date1.getTime() - date2.getTime();

    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= daysDifference * 1000 * 60 * 60;

    let minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= daysDifference * 1000 * 60;

    let secondsdifference = Math.floor(difference / 1000);

    if (daysDifference < 1) {
      if (hoursDifference < 1) {
        if (minutesDifference < 1) {
          return secondsdifference + " Seconds ago";
        } else {
          return minutesDifference + " Minutes ago";
        }
      } else {
        return hoursDifference + " Hours ago";
      }
    } else {
      return daysDifference+ " Days ago" ; 
    }
  }

  function loadSinglePost(post) {
    

    fetch(`http://localhost:8000/posts/comments/${post._id}`,{
        headers:{
            "authorization": `Bearer ${loginDetails.current.token}`
        }
    })
    .then(response=>response.json())
    .then((data)=>{
        if(data.success===true){
            let tempPosts = {...post}
            console.log(data)
            tempPosts.comments= data.comments;
            setPostModalVisible(true);
            setSinglePost(tempPosts);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
  }

  function checkSingleLike(singlePost) {
    likeSingle.current = singlePost.likes.find((like, idx) => {
      return like.user === loginDetails.current.userId;
    });
    return likeSingle.current;
  }

  useEffect(()=>{

    fetch(`http://localhost:8000/connections/pending/${loginDetails.current.userId}`,{
      headers:{
        "authorization": `Bearer ${loginDetails.current.token}`,
      }
    })
    .then(response=>response.json())
    .then((data)=>{
      // console.log(data);
      if(data.success === true){
        setRequests(data.requests);
      }
    })
    .catch((err)=>{
      console.log(err);
    })

  },[])
  
  function acceptRequest(connectionId){

    fetch(`http://localhost:8000/connections/changestatus/${connectionId}`,{
      method:"PUT",
      headers:{
        "authorization": `Bearer ${loginDetails.current.token}`,
        "Content-Type": "application/json",
      },
      body:JSON.stringify({status:"accepted"}),
    })
    .then(response => response.json())
    .then((data)=>{
      if(data.success=== true){
        // console.log(data);
        let tempRequests = [...requests];
        let requestIdx = tempRequests.findIndex((req,idx)=>{
          return req._id === connectionId;
        })

        tempRequests.splice(requestIdx,1);

        setRequests(tempRequests);

      }
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  function deleteRequest(connectionId){

    fetch(`http://localhost:8000/connections/connection/${connectionId}`,{
      method:"DELETE",
      headers:{
        "authorization":`Bearer ${loginDetails.current.token}`,
      }
    })
    .then((response)=>response.json())
    .then((data)=>{
      if(data.success===true){
        console.log(data)
        let tempRequests = [...requests];
        let requestIdx = tempRequests.findIndex((req,idx)=>{
          return req._id === connectionId;
        })

        tempRequests.splice(requestIdx,1);

        setRequests(tempRequests);
      }
     })
    .catch((err)=>{
      console.log(err)
    })

  }

  function savePosts(postId){
    fetch(`http://localhost:8000/posts/savepost/${loginDetails.current.userId}`,{
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${loginDetails.current.token}`,
        },
        body:JSON.stringify({postId:postId}),
    })
    .then(res=>res.json())
    .then((data)=>{
      // console.log(data)
      // if (data.success) {
      //   navigate("/chat")
      // }
    })
    .catch((err)=>{
      console.log(err)
    })

  
  }

  return (
    <>
      {postModalVisible === true ? (
        <div
          onClick={() => {
            setPostModalVisible(false);
          }}
          className="post_modal"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="post_modal_child"
          >
            <div className="post_pic">
            {
              singlePost.fileType==="VIDEO"?(
                <video className="post-image" src={singlePost.contents[0]} autoPlay muted loop></video>
              ):(

                <img src={singlePost?.contents[0]} alt="postpic" />
              )
            }
             
            </div>


            

            <div className="post_details">
              <div className="info">
                <div className="user">
                  <div className="profile-pic">
                    <img src={singlePost.user?.profilePic} alt="img$" />
                  </div>
                  <p className="username">{singlePost?.user.username}</p>
                </div>
                <i class="fa-solid fa-ellipsis"></i>
              </div>

              <div className="single_post_comments">
                <p className="description">
                  <span>{singlePost.user?.username}</span>
                  {singlePost?.caption}
                </p>
                {singlePost.comments.length!== 0 ? (
                  <>
                    {singlePost.comments.map((comm, idx) => {
                      return (
                        <div key={idx} className="single_post_comment comment">
                          <div className="single_comment_content">
                            <div className="profile-pic comment_profile_pic">
                              <img src={comm.user?.profilePic} alt="img$" />
                            </div>
                            <span>{comm.user?.username}</span>
                            <p className="comm_msg">{comm?.comment}</p>
                          </div>
                            <p className="comm_time">
                              {timeDifference(new Date(), new Date(comm?.createdAt))}

                              {
                                comm.user._id === loginDetails.current.userId?
                                <i onClick={()=>{deleteComment(comm._id,singlePost)}} className=" comm_del_btn fa-solid fa-trash-can"></i>
                                :null
                              }
                            </p>



                        </div>
                      );
                    })}
                  </>
                ) : null}
              </div>

              <div className="post-content">
                <div className="reaction-wrapper">
                  {checkSingleLike(singlePost) === undefined ? (
                    <i
                      onClick={() => {
                        like(singlePost?._id);
                      }}
                      className=" icons fa-regular fa-heart"
                    ></i>
                  ) : (
                    <i
                      onClick={() => {
                        unlikePost(likeSingle.current?._id, singlePost?._id);
                      }}
                      className=" icons fa-solid fa-heart red"
                    ></i>
                  )}
                  <i className=" icons fa-regular fa-comment"></i>

                  <i className=" icons fa-regular fa-paper-plane"></i>

                  <i className=" icons fa-regular fa-bookmark"></i>
                </div>
                <p className="likes">
                  <span>{singlePost.likes?.length}</span> likes
                </p>
                <p className="post-time">
                      {timeDifference(new Date(), new Date(singlePost?.createdAt))}
                </p>

              </div>

              <div className="comment-wrapper">
                {/* <img alt="img$" src="./images/smile.PNG" className="icon" /> */}
                <i className=" icon fa-regular fa-face-smile"></i>

                <div ref={form}  className="comment_form">
                  <input onChange={(event) => {commentMsg["comment"] = event.target.value;}}
                    type="text"
                    className="comment-box"
                    placeholder="Add a comment..."
                  />

                  <button onClick={() => {
                          comment(singlePost._id,"single");
                        }} type="button" className="comment-btn">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Header />
      <section className="main">
        <div className="wrapper">
          <div className="left-col">
        {

          allPosts.length!==0?
            allPosts.map((post, idx) => {
              let liked = post.likes.find((like, idx) => {
                return like.user === loginDetails.current.userId;
              });
              // console.log(liked)

              return (
                <div key={idx} className="post">
                  <div className="info">
                    <div className="user">
                      <div className="profile-pic">
                        <img alt="img$" src={post.user?.profilePic} />
                      </div>
                      <p className="username">{post.user?.username}</p>
                    </div>
                    <img
                      alt="img$"
                      src="./images/option.PNG"
                      className="options"
                    />
                  </div>

                 
                      {
                          post.fileType==="VIDEO"?(
                            <video className="post-image" src={post.contents[0]} autoPlay muted loop></video>
                          ):(

                            <img alt="img$" src={post?.contents[0]} className="post-image"/>
                          )
                        }
                  <div className="post-content">
                    <div className="reaction-wrapper">
                      {liked === undefined ? (
                        <i
                          onClick={() => {like(post?._id)}}
                          className=" icons fa-regular fa-heart"
                        ></i>
                      ) : (
                        <i
                          onClick={() => {unlikePost(liked?._id, post?._id);}}
                          className=" icons fa-solid fa-heart red"
                        ></i>
                      )}
                      <i
                        onClick={() => {loadSinglePost(post)}}
                        className=" icons fa-regular fa-comment"
                      ></i>

                      <i className=" icons fa-regular fa-paper-plane"></i>

                      <i onClick={()=>{
                        savePosts(post._id)
                      }} className=" icons fa-regular fa-bookmark"></i>
                    </div>

                    <div className="mid_content">
                    <p className="likes">
                      <span>{post.likes.length}</span> likes
                    </p>
                    <p className="description">
                      <span>{post.user?.username}</span>
                      {post?.caption}
                    </p>

                    {post.commentCount !== 0 ? (
                      <>
                        <p
                          onClick={() => {loadSinglePost(post)}}
                          className="comment_count"
                        >
                          view all {post?.commentCount} comments
                        </p>

                        {post.comments.map((comm, idx) => {
                          return (
                            <p key={idx} className="comment">
                              <span>{comm.user?.username}</span>
                              {comm?.comment}
                            </p>
                          );
                        })}
                      </>
                    ) : null}
                    </div>
                    <p className="post-time">
                      {timeDifference(new Date(), new Date(post?.createdAt))}
                    </p>
                  </div>

                  <div className="comment-wrapper">
                    <img alt="img$" src="./images/smile.PNG" className="icon" />

                    <div  className="comment_form">
                      <input value={inpComment}
                        onChange={(event) => {
                          commentMsg["comment"] = event.target.value;

                        }}
                        type="text"
                        className="comment-box"
                        placeholder="Add a comment..."
                      />

                      <button
                        onClick={() => {comment(post._id,"limited")}}
                        type="button"
                        className="comment-btn"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                </div>
              );

            }):(
              <>

                <div className="no_post_container">
                  <h1 className="warn_text">No Posts Found !</h1>
                  <h4>follow someone to see their posts</h4>
                  <Link to="/createpost">
                    <button className="create_btn">Create a Post</button>
                  </Link>
                </div>
              </>
            )

          }
          </div>

          <div className="right-col">

            {
              requests.length!==0?(
                <>
                  <p className="suggestion-text">Pending Follow Requests</p>

                        {
                          requests.map((req,idx)=>{
                            return(
                              <div key={idx} className="profile-card">

                                <div className="profile-pic">
                                  <img alt="img$" src={req.follower?.profilePic} />
                                </div>
                  
                                <div>
                                  <p className="username">{req.follower?.username}</p>
                                  <p className="sub-text">{req.follower?.name}</p>
                                </div>
                  
                                <button className="action-btn"onClick={()=>{
                                  acceptRequest(req._id);
                                }} >Accept</button>

                                <button onClick={()=>{
                                  deleteRequest(req._id);
                                }} className="action-btn">Delete</button>

                              </div>
                            )
                          })
                        }
                  </>
              ):null
            }
          

            
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;
