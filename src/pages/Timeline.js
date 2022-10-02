import React from 'react'
import "../css/Timeline.css";
import Header from '../components/Header';
import { useEffect,useRef } from 'react';
import { useState } from 'react';

const Timeline = () => {

    let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")));
    let [timeline,setTimeLine] = useState([]);

    useEffect(()=>{

        fetch(`http://localhost:8000/users/timeline/${loginDetails.current.userId}`,{
            headers:{
                "authorization": `Bearer ${loginDetails.current.token}`,
            }
        })
        .then(response=>response.json())
        .then((data)=>{
            if(data.success===true){
                // console.log(data);
                // let unfilteredTimeline = [...data.likes,...data.comments];

                let timeline = [...data.followers,...data.likes,...data.comments]

                // unfilteredTimeline.forEach((tl,idx)=>{
                //     if (tl.post!==null) {
                //         timeline.push(tl)
                //     }
                // })

                console.log(timeline)               

                timeline.sort((a,b)=>{
                    return new Date(b.createdAt) - new Date(a.createdAt)
                })

                setTimeLine(timeline)
                // timeline.map((tl,idx)=>{
                //     console.log(new Date(tl.createdAt))
                // })
            }
        })
        .catch((err)=>{
            console.log(err);
        })

    },[])

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


    function loadTimeLine(tl,idx){

        if (tl.comment!==undefined) {

            return <section key={idx} className="timeline_node">
                        <div className="user_img">
                            <img src={tl.user.profilePic} alt="userpic" />
                        </div>
                        <div className='timline_content'>
                            <span>{tl.user.name} commented on your post</span>
                            <span>{timeDifference(new Date(), new Date(tl.createdAt))}</span>
                        </div>
                        <div className='post_img'>
                            <img src={tl.post.contents} alt="" />
                        </div>
                    </section>

        }else if (tl.post!==undefined && tl.comment === undefined) {

            return <section key={idx} className="timeline_node">
                        <div className="user_img">
                            <img src={tl.user.profilePic} alt="userpic" />
                        </div>
                        <div className='timline_content'>
                            <span>{tl.user.name} Liked your post</span>
                            <span>{timeDifference(new Date(), new Date(tl.createdAt))}</span>
                        </div>
                        <div className='post_img'>
                            <img src={tl.post.contents} alt="" />
                        </div>
                    </section>
        }else{
            return <section key={idx} className="timeline_node">
                        <div className="user_img">
                            <img src={tl.follower.profilePic} alt="userpic" />
                        </div>
                        <div className='timline_content'>
                            <span>{tl.follower.name} Followed You</span>
                            <span>{timeDifference(new Date(), new Date(tl.createdAt))}</span>
                        </div>
                    </section>
        }
    }

  return (
    <>
    <Header/>
    <h1 className='time_head'>Your Timeline</h1>
    <div className='timeline_container'>
            {
                timeline.map((tl,idx)=>{
                    return(
                        loadTimeLine(tl,idx)
                    )
                })
            }
    </div>
    </>
  )
}

export default Timeline;