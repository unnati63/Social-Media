import React, { useContext, useEffect, useState } from 'react'
import "./feed.css";
import Share from '../share/Share';
import Post from '../post/Post';
// import {Posts} from "../../dummyData"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext';

export default function Feed({username}) {
  const [posts,setPosts]=useState([]);
  const {user}=useContext(AuthContext);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(()=>{
    const fetchPosts=async()=> {
      // const res=await axios.get("posts/timeline/65f3065fe00614a1ed363c2c")
      // setPosts(res.data);

      try {
      const res = username 
      ? await axios.get(`${API_BASE_URL}/posts/profile/` + username) 
      : await axios.get(`${API_BASE_URL}/posts/timeline/`+user?._id);
      setPosts(res.data.sort((p1,p2)=>{
        return new Date(p2.createdAt)-new Date(p1.createdAt);
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    }
    fetchPosts();
  },[username,user?._id])
  return (
    <div className='feed'>
      <div className="feedWrapper">
        {(!username || username===user.username) && <Share/>}
        {posts.map(p=>(
          <Post key={p._id} post={p}/>
        ))}
        
      </div>
    </div>
  )
}
