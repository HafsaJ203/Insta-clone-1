import React from "react";
import './App.css';
import img1 from './images/header-logo-2.png'
import img2 from './images/header-logo.png'
import Post from './post.js'
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Input } from "@mui/material";
import ImageUpload from "./ImageUpload";



/* ------------------------------ MODAL STYLES ------------------------------ */


const useStyles ={
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


  /* ----------------------------------- APP ---------------------------------- */

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);


  /* -------------------------------- AUTH USER ------------------------------- */

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser){
        ///user has logged in...
        console.log(authUser);
        setUser(authUser);
      }
      else{
        ///user has logged out...
        setUser(null);
      }
      })

      return () => {
        unsubscribe();
      }
    }, [user, username]);




    /* -------------------------- MAP AND UPDATATING DB ------------------------- */

  //useEffect -> Runs a piece of code based on a specific condition

    useEffect(() => {
      db.collection('posts').orderBy('time', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          posts: doc.data()
        })));
      })
      //everytime a new post is added, this code fires
    }, [])



    /* ------------------------ SIGN IN FROM FIREBASE DB ----------------------- */
  
    const signIn = (event) => {
      event.preventDefault();
    
      auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  
      setOpenSignIn(false)
    }

 /* ---------------------------- SIGN UP IF USER NOT AN EXISTING USER ---------------------------- */
 
 const signUp = (event) => {
      event.preventDefault();
  
      auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser => {
        return authUser.user.updateProfile({
          displayName: username, 
        })
      }))
      .catch((error) => alert(error.message));
  
      setOpen(false);
    };
  

  return (
   
    <div className="app">
      {/* --------------------------------- HEADER --------------------------------- */}

          
            <div className="app__header">
            <img className="app__headerImage" src={img1} alt=''/>



              {/* -------- {IF USER THEN DISPLAY LOG-OUT BUTTON: IF NOT USER THEN..} ------- */}

              {
                user ? (
                  <div className="logout_username">
                    <h5 className="username_display" title="Username">{user.displayName} |</h5>
                    <Button id="logOutbtn" onClick={() => auth.signOut()} title="Log-Out">Log Out</Button>
                  </div>
                  ): (
                  <div className="app__logincontainer">

                    <Button id="signInbtn" onClick={() => setOpenSignIn(true)} title="Sign-In">Sign In</Button>
                    <Button id="signUpbtn" onClick={handleOpen} title="Sign-Up">Sign up</Button>

                  </div>      
              )
              }

            </div>
          
            {/* ------------------------------------ if user then display post map else redirect to login page -------------------------------------- */}

            <div className="app__posts">
                  
                  <div className="app__postsLeft">

                    {
                      posts.map(({id, posts}) => (
                      <Post key={id} postId={id} user={user}  displayName={username} username={posts.username} caption={posts.caption} imageUrl={posts.imageUrl}/>
                      ))
                    }

                  </div>

                  <div className="app__postsRight">


              </div>

            </div>
                     

            {/* -------------------- IMAGEUPLOAD FROM LOCALFILES TO DB ------------------- */}

            {
              user?.displayName ? (
                <ImageUpload username={user.displayName} />
              ): (
                <h4 className="loginInToUp"  onClick={() => setOpenSignIn(true)} title="Duh">Login to upload</h4>
              )
            }


            {/* ------------------------------ SIGN IN MODAL ----------------------------- */}




          <Modal
                  open={openSignIn}
                  onClose={() => setOpenSignIn(false)}
                > 
                <Box sx={useStyles}>

                  <Typography id="modal-modal-title" variant="h6" component="h2">
                  <form className="app__signup">
                    <center>
                      <img 
                      className="app__headerImage2"
                      src={img2}
                      alt="" 
                    />
                    </center>

                  <Input
                    placeholder="email"
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />

                  <Input
                    placeholder="password"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />

                <Button onClick={signIn}>Sign In</Button>
                </form>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>

                </Box>  
          </Modal>

           {/* ------------------------------ SIGN UP MODAL ----------------------------- */}

          <Modal
                  open={open}
                  onClose={handleClose}
                > 
                <Box sx={useStyles}>

                  <Typography id="modal-modal-title" variant="h6" component="h2">
                  <form className="app__signup">
                    <center>
                      <img 
                      className="app__headerImage2"
                      src={img2}
                      alt="" 
                    />
                    </center>

                  <Input
                    placeholder="username"
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <Input
                    placeholder="email"
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />

                  <Input
                    placeholder="password"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <Button onClick={signUp} type="submit">sign up</Button>

                </form>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>

                </Box>  
          </Modal>
   
      </div>
  
    
  );
};

export default App;
