import './post.css';
import { db } from './firebase';
import { useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import { Avatar } from '@mui/material';




function Post({ postId, user, username, caption, imageUrl}) {
  const [comments, setComments ] = useState([]);
  const [comment, setComment] = useState([]);

 

  useEffect(() => {
    let unsubscribe
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(`${postId}`)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);


const postComment = (event) => {
  event.preventDefault();

  db.collection('posts').doc(`${postId}`).collection('comments').add({
    text: comment,
    username: user.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  setComment('');
}



  return (
    <div className='post'>

      <div className='post__header'>

      <Avatar 
        className='post__avatar' 
        alt={username} 
        src='/static/images/avatar/1.png'/>
          <h3 className='usernametext' title='Username'>{username}</h3>
            
           {
              user?.displayName === username &&
             
              <div>
              <button className='delPost__btn' onClick={() => {
                db
                .collection("posts")
                .doc(postId)
                .delete()
              }}
              ><img title='!Delete Post!' className='del_Icon' src="https://icon-library.com/images/delete-icon-png/delete-icon-png-19.jpg" alt=''/>
              </button>
              </div>
            }

      </div>


        <img className='postImage' title='Image lol' src={imageUrl} alt=''/>

          

        <h4 className='postText'><strong title='Username'>{username}:</strong> {caption}</h4>
        
        

              <div className='post__comments'>
                    {
                      comments.map((comment) => (
                          <p className='p'>
                          <strong>{comment.username}</strong>:&nbsp; {comment.text}
                          </p>
                      ))
                    }
              </div>   
            

      {user && (
        <form className='post__commentbox' >
        
        <textarea autosize
          className='post__input'
          type='text'
          placeholder="Add a comment..."
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
        ></textarea>
        
        <button
        title='Post'
        disabled={!comment}
        className='post__button'
        type='submit'
        onClick={postComment}
        >Post</button>
       
      </form>
      )}
      
    </div>
  )
}


export default Post;