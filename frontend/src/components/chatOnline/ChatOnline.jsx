import React, { useEffect, useState } from 'react'
import "./chatOnline.css"
import axios from "axios"

export default function ChatOnline({onlineUsers,currentId,setCurrentChat}) {
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    const [friends,setFriends]=useState([]);
    const [onlineFriends,setOnlineFriends]=useState([]);

    useEffect(()=>{
        
        const getFriends=async ()=>{
            try{
                const res=await axios.get(`${API_BASE_URL}/users/friends/${currentId}`);
                console.log('getfriends useeffect' , res)
            setFriends(res.data.data);
            }catch(err){
                console.log("problem in chat online",err);
            }
            
        }
        getFriends();
    },[currentId]);
    
    useEffect(()=>{
        console.log('setOnlineFriends useeffect')
        setOnlineFriends(friends?.filter((f)=>onlineUsers.includes(f._id)))
    },[friends,onlineUsers])


    const handleClick =async (user)=>{
        try{
            const res=await axios.get(`${API_BASE_URL}/conversations/find/${currentId}/${user._id}`)
            if (res.data) {
                setCurrentChat(res.data);
            } else {
                // Create a new conversation if it doesn't exist
                const newConversation = await axios.post(`${API_BASE_URL}/conversations`, {
                    senderId: currentId,
                    receiverId: user._id,
                });
                setCurrentChat(newConversation.data);
            }
        }catch(err){
            console.log(err);
        }
    }
    // console.log("online friends",onlineFriends);
  return (
    <>
        <div className="chatOnline">
        
        {onlineFriends &&onlineFriends.map((o,index)=>(
            <div className="chatOnlineFriend" key={index} onClick={()=>handleClick(o)}>
                <div className="chatOnlineImgContainer">
                    <img className='chatOnlineImg' src={o?.profilePicture? PF+o?.profilePicture: PF+"person/noAvatar.png"} alt="" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName"> {o.username} </span>
            </div>
        ))}
            
        </div>
    </>
  )
}
