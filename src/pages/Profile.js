import React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/Profile.css";

const Profile = () => {
  let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")));
  let [postModalVisible, setPostModalVisible] = useState(false);
  let [singlePost, setSinglePost] = useState({});
  let likeSingle = useRef(null);
  let commentMsg = {
    user: loginDetails.current.userId,
  };

  let params = useParams();
  let navigate = useNavigate();
  let [editModalVisible, setEditModalVisible] = useState(false);
  let [profile, setProfile] = useState({});
  let updateProfileDetails = new FormData();

  useEffect(() => {
    fetch(
      `http://localhost:8000/users/profile/${params.username}/${loginDetails.current.userId}`,
      {
        headers: {
          authorization: `Bearer ${loginDetails.current.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          setProfile(data);
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params]);

  function follow() {
    fetch("http://localhost:8000/connections/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${loginDetails.current.token}`,
      },
      body: JSON.stringify({
        follower: loginDetails.current.userId,
        following: profile.user._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          let tempProfile = { ...profile };
          tempProfile.connection = data.connection;
          tempProfile.followers.push(data.connection);
          setProfile(tempProfile);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function unFollow() {
    fetch(
      `http://localhost:8000/connections/connection/${profile.connection._id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${loginDetails.current.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          let tempProfile = { ...profile };
          let myIndex = tempProfile.followers.findIndex((followerData, idx) => {
            return (
              followerData.follower === tempProfile.connection.follower &&
              followerData.following === tempProfile.connection.following
            );
          });
          // console.log(myIndex)
          tempProfile.followers.splice(myIndex, 1);
          tempProfile.connection = data;
          setProfile(tempProfile);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loadButton() {
    if (profile.connection?.status === "same") {
      return (
        <div className="buttons">
          <button
            onClick={() => {
              setEditModalVisible(true);
            }}
            className="btn1"
          >
            Edit Profile
          </button>
          <button className="btn2" onClick={logout}>
            Logout
          </button>

          <button className="btn1">
            <i 
           onClick={()=>{
            getSavedPosts()
           }} className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      );
    } else if (profile.connection?.status === "accepted") {
      return (
        <div className="buttons">
            <button className="btn1" onClick={()=>{
            addchatPerson(profile.user._id)
          }}>Message</button>
          <button className="btn2" onClick={unFollow}>
            Unfollow
          </button>
          <button className="btn3">
            <i className="fa-solid fa-angle-down"></i>
          </button>
          <button className="btn1">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      );
    } else if (profile.connection?.status === "pending") {
      return (
        <div className="buttons">
            <button className="btn1" onClick={()=>{
            addchatPerson(profile.user._id)
          }}>Message</button>
          <button className="btn2">Requested</button>
          <button className="btn3">
            <i className="fa-solid fa-angle-down"></i>
          </button>
          <button className="btn1">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      );
    } else if (profile.connection?.status === "nothing") {
      return (
        <div className="buttons">
          <button className="btn1" onClick={()=>{
            addchatPerson(profile.user._id)
          }}>Message</button>
          <button className="btn2" onClick={follow}>
            Follow
          </button>
          <button className="btn3">
            <i className="fa-solid fa-angle-down"></i>
          </button>
          <button className="btn1">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      );
    }
  }

  function readValue(property, value) {
    updateProfileDetails.append(property, value);
  }

  function updateProfile() {
    fetch(`http://localhost:8000/users/${loginDetails.current.userId}`, {
      method: "PUT",
      headers: {
        "authorization": `Bearer ${loginDetails.current.token}`,
      },
      body: updateProfileDetails,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          // console.log(data);

          navigate(`/profile/${data.user?.username}`);
          setEditModalVisible(false);
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
      return daysDifference + " Days ago";
    }
  }

  function comment(postId, where) {
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
          // if(where==="limited"){

          //   let tempPosts = [...allPosts]
          //   let post = tempPosts.find((post, idx) => {
          //     return post._id === postId;
          //   });

          //   post.comments.push(data.comment)
          //   post.commentCount +=1;
          //   setAllPosts(tempPosts);

          // }else
          if (where === "single") {
            let post = { ...singlePost };
            post.comments.unshift(data.comment);
            setSinglePost(post);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteComment(commentId, post) {
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

          let tempPost = { ...post };
          let commentIndex = tempPost.comments.findIndex((comm, idx) => {
            return comm._id === commentId;
          });
          // console.log(commentIndex);

          tempPost.comments.splice(commentIndex, 1);
          setSinglePost(tempPost);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function like(postId) {
    fetch("http://localhost:8000/posts/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${loginDetails.current.token}`,
      },
      body: JSON.stringify({ post: postId, user: loginDetails.current.userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          let tempPost = { ...singlePost };
          tempPost.likes.push(data.like);
          setSinglePost(tempPost);
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
          console.log(data);
          let tempPost = { ...singlePost };

          let likeIndex = tempPost.likes.findIndex((like, idx) => {
            return like.user === loginDetails.current.userId;
          });
          console.log(likeIndex);

          tempPost.likes.splice(likeIndex, 1);
          setSinglePost(tempPost);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loadSinglePost(post) {
    fetch(`http://localhost:8000/posts/comments/${post._id}`, {
      headers: {
        authorization: `Bearer ${loginDetails.current.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          let tempPosts = { ...post };
          // console.log(tempPosts)
          // console.log(data)
          tempPosts.comments = data.comments;
          setPostModalVisible(true);
          setSinglePost(tempPosts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function checkSingleLike(singlePost) {
    likeSingle.current = singlePost.likes.find((like, idx) => {
      return like.user === loginDetails.current.userId;
    });
    return likeSingle.current;
  }

  function addchatPerson(chatId){

    fetch(`http://localhost:8000/users/addchat/${loginDetails.current.userId}`,{
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${loginDetails.current.token}`,
        },
        body:JSON.stringify({chatId:chatId}),
    })
    .then(res=>res.json())
    .then((data)=>{
      // console.log(data)
      if (data.success) {
        navigate("/chat")
      }
    })
    .catch((err)=>{
      console.log(err)
    })

  }

  function getSavedPosts(){

  fetch(`http://localhost:8000/posts/savedlist/${loginDetails.current.userId}`,{
            headers: {
                authorization: `Bearer ${loginDetails.current.token}`,
            },
        })
        .then(res=>res.json())
        .then((data)=>{
            console.log(data)
            // if (data.success) {
            //     setChatList(data.user.chatList)
            // }
        })
        .catch((err)=>{
            console.log(err)
        })
  }

  function logout(){
    localStorage.removeItem("login_details");
    navigate("/login");
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
              {singlePost.fileType === "VIDEO" ? (
                <video
                  className="post-image"
                  src={singlePost.contents[0]}
                  autoPlay
                  muted
                  loop
                ></video>
              ) : (
                <img src={singlePost.contents[0]} alt="postpic" />
              )}
            </div>

            <div className="post_details">
              <div className="info">
                <div className="user">
                  <div className="profile-pic">
                    <img src={profile.user?.profilePic} alt="img$" />
                  </div>
                  <p className="username">{profile?.user.username}</p>
                </div>
                <i className="fa-solid fa-ellipsis"></i>
              </div>

              <div className="single_post_comments">
                <p className="description">
                  <span>{profile.user?.username}</span>
                  {singlePost?.caption}
                </p>
                {singlePost.comments.length !== 0 ? (
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
                            {timeDifference(
                              new Date(),
                              new Date(comm?.createdAt)
                            )}

                            {comm.user._id === loginDetails.current.userId ? (
                              <i
                                onClick={() => {
                                  deleteComment(comm._id, singlePost);
                                }}
                                className=" comm_del_btn fa-solid fa-trash-can"
                              ></i>
                            ) : null}
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
                <i className="smile_icon fa-regular fa-face-smile"></i>

                <div className="comment_form">
                  <input
                    onChange={(event) => {
                      commentMsg["comment"] = event.target.value;
                    }}
                    type="text"
                    className="comment-box"
                    placeholder="Add a comment..."
                  />

                  <button
                    onClick={() => {
                      comment(singlePost._id, "single");
                    }}
                    type="button"
                    className="comment-btn"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* post madal ends here****************************************************** */}

      {editModalVisible === true ? (
        <div
          onClick={() => {
            setEditModalVisible(false);
          }}
          className="edit_modal"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="edit_modal_child"
          >
            <h2 className="modal_head">Update Profile Details</h2>
            <i
              onClick={() => {
                setEditModalVisible(false);
              }}
              className=" close-btn fa-solid fa-circle-xmark"
            ></i>

            <input
              className="inp"
              type="text"
              placeholder="Enter Name"
              onChange={(e) => {
                readValue("name", e.target.value);
              }}
              defaultValue={profile.user?.name}
            />

            <input
              className="inp"
              type="text"
              placeholder="Enter Username"
              onChange={(e) => {
                readValue("username", e.target.value);
              }}
              defaultValue={profile.user?.username}
            />

            <input
              className="inp"
              type="text"
              placeholder="Enter Bio"
              onChange={(e) => {
                readValue("bio", e.target.value);
              }}
              defaultValue={profile.user?.bio}
            />

            <input
              className="inp"
              type="url"
              placeholder="Enter Site Link"
              onChange={(e) => {
                readValue("link", e.target.value);
              }}
              defaultValue={profile.user?.link}
            />

            <input
              className="inp"
              type="file"
              onChange={(e) => {
                readValue("profilePic", e.target.files[0]);
              }}
            />

            <select
              onChange={(e) => {
                readValue("type", e.target.value);
              }}
              defaultValue={profile.user?.type}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <button onClick={updateProfile} className="btn update-btn">
              Update Profile
            </button>
          </div>
        </div>
      ) : null}

      <Header />
      <div className="profile_section">
        <div className="user_profile">
          <div className="user_img_sec">
            <img src={profile.user?.profilePic} alt="" />
          </div>
          <div className="user_details_sec">
            <div className="row row_1">
              <h2>{profile.user?.username}</h2>

              {loadButton()}
            </div>

            <div className="row row_2">
              <p>
                <span>{profile.posts?.length}</span>posts
              </p>
              <p>
                <span>{profile.followers?.length}</span>follower
              </p>
              <p>
                <span>{profile.following?.length}</span>following
              </p>
            </div>

            <div className="row row_3">
              <h3>{profile.user?.name}</h3>
            </div>

            {profile.user?.bio !== "" ? (
              <div className="row row_4">
                <p>{profile.user?.bio}</p>
              </div>
            ) : null}

            {profile.user?.link !== "" ? (
              <div className="row row_5">
                <a href={profile.user?.link}>{profile.user?.link}</a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="posts">
          {profile.posts?.map((post, idx) => {
            return (
              <div
                onClick={() => {
                  loadSinglePost(post);
                }}
                className="post_thumb"
                key={idx}
              >
                {post.fileType === "VIDEO" ? (
                  <video
                    className="post-image"
                    src={post.contents[0]}
                    autoPlay
                    muted
                    loop
                  ></video>
                ) : (
                  <img src={post.contents[0]} alt="posts of users" />
                )}
                <div className="overlay">
                  <span>
                    <i className="fa-solid fa-heart"></i>
                    {post.likes?.length}
                  </span>
                  <span>
                    <i className="fa-solid fa-comment"></i>
                    {post.commentCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
