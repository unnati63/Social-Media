import React, { useState,useEffect, useContext } from 'react'
import "./post.css";
import { MoreVert } from '@mui/icons-material';
import axios from 'axios';
import {format} from "timeago.js";
import {Link} from "react-router-dom"
import { AuthContext } from '../../context/AuthContext';


export default function Post({post}) {
    

    const [like,setLike]=useState(post.likes.length);
    const [isLiked,setisLiked]=useState(false);
    const [user,setUser]=useState({})
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isCommentExpanded, setIsCommentExpanded] = useState(false);
    const [file, setFile] = useState(null); 
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser}=useContext(AuthContext);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    

    useEffect(()=>{
      setisLiked(post.likes.includes(currentUser._id))
    },[currentUser._id,post.likes])

    useEffect(()=>{
    const fetchUser=async()=> {
    
    try {
        const res = await axios.get(`${API_BASE_URL}/users?userId=${post.userId}`);
        setUser(res.data);
        } catch (error) {
        console.error('Error fetching user data:', error);
        }
    }
    fetchUser();
  },[post.userId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/comments/post/${post._id}`);
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [post._id]);

    const likeHandler=()=>{
        try{
          axios.put("/posts/"+post._id+"/like",{userId:currentUser._id})
        }
        catch(error){
          console.error('Error liking post:', error);
        }
        setLike(isLiked?like-1:like+1);
        setisLiked(!isLiked);
    }

    const handleCommentSubmit = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/comments`, {
          postId: post._id,
          userId: currentUser._id,
          content: commentText,
        });
        setComments([...comments, res.data]);
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const toggleCommentExpansion = () => {
      setIsCommentExpanded(!isCommentExpanded);
    };

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handlePostSubmit = async (e) => {
      e.preventDefault();
      const newPost = {
        userId: currentUser._id,
        desc: commentText,
      };
  
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append('name', fileName);
        data.append('file', file);
        newPost.img = fileName;
  
        try {
          await axios.post(`${API_BASE_URL}/upload`, data);
        } catch (err) {
          console.error('Error uploading file:', err);
        }
      }

      try {
        await axios.post(`${API_BASE_URL}/posts`, newPost);
        window.location.reload();
      } catch (err) {
        console.error('Error creating post:', err);
      }
    };
  return (
    <div className='post'>
    <div className="postWrapper">
        <div className="postTop">
            <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
            <img src={user.profilePicture? PF+ user.profilePicture : PF+"person/noAvatar.png"} alt="" className="postProfileImg" />
            </Link>
                
                <span className="postUsername">{user.username}</span>
                <span className="postDate">{format(post.createdAt)}</span>
            </div>
            <div className="postTopRight">
                <MoreVert/>
            </div>
        </div>
        <div className="postCenter">
            <span className="postText">{post?.desc}</span>
            <img src={PF+post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
            <div className="postBottomLeft">
                <img className='likeIcon' src={`${PF}like.png`} onClick={likeHandler} alt="" />
                <img className='likeIcon' src={`${PF}heart.png`} onClick={likeHandler} alt="" />
                <span className="postlikeCounter">{like} people liked it</span>
            </div>
            <div className="postBottomRight" onClick={toggleCommentExpansion}>
                <span className="postCommentText">{comments.length} comments</span>
            </div>
        </div>
        {isCommentExpanded && (
          <div className="postComments">
          {comments.map((comment) => (
            <div key={comment?._id} className="postComment">
            <Link to={`/profile/${comment?.userId}`}>
                  <img src={comment?.userProfilePicture ? PF + comment?.userProfilePicture : PF + 'person/noAvatar.png'} alt="" className="commentProfileImg" />
                </Link>
                <div className="commentContent">
                  <Link to={`/profile/${comment?.userId}`}>
                    <span className="postCommentUsername">{comment?.username}</span>
                  </Link>
                  <span className="postCommentText">{comment.content}</span>
                </div>
              </div>
          ))}
        </div>
        )}
        
        <div className="postCommentInput">
          <input
            type="text"
            placeholder="Add a comment..."
            className="postCommentInputText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="postCommentButton" onClick={handleCommentSubmit}>
            Post
          </button>
        </div>
    </div>
        
    </div>
  );
}

