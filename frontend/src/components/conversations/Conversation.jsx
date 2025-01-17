import React, { useEffect, useState } from 'react'
import "./conversation.css"
import axios from "axios"

export default function Conversation({conversation,currentUser}) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [user,setUser]=useState(null);
  useEffect(()=>{
    const friendId=conversation.members.find((m)=>m !== currentUser._id);
    const getUser=async ()=>{
      try{
        const res=await axios(`${API_BASE_URL}/users?userId=${friendId}`)
        setUser(res.data);
      }catch(err){
        console.log(err);
      }
      
    };
    getUser();

  },[currentUser,conversation])
  const PF=process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
      <div className="conversation">
        <img src={user?.profilePicture?PF+ user.profilePicture : PF+"person/noAvatar.png"} alt="" className="conversationImg" />
        <span className="conversationName">{user?.username}</span>
      </div>
    </>
  )
}
