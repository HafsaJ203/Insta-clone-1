import { Button } from '@mui/material';
import React, { useState } from 'react';
import { db, storage } from './firebase';
import firebase from 'firebase/compat/app';
import "./ImageUpload.css";
import plusicon from './images/plusicon.png'




function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0)
       
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }    
    };

    const handleUpload = () => {
        if (image === null) {
            alert("Please select an image...")
            return;
        }
       const uploadTask =  storage.ref(`images/${image.name}`).put(image)
        // update progress bar while uploading image to cloudinary
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                // Progress function..
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                setProgress(progress);
            },
                // Error function...
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                // Complete function...
                storage
                    .ref("images")
                    .child(`${image.name}`)
                    .getDownloadURL()
                    .then(url=>{
                        // Post image inside db...
                        db.collection("posts").add({
                            time: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                })
            }
        )}



return (
    <div className='imageupload'>

        

        <div className='bars'>
        <progress title='Progress-Bar' className='imageupload__progress' value={progress} max='100' />
        

      
        <textarea autoresize type='text' className='captionbox' placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption}></textarea>
        
        
        </div>
    
        <label className='plusIcon'>
           <input type="file" className='filepicker' onChange={handleChange} />
           <img className='plusImg' title='Pick an Image to post..' src={plusicon} alt=''/>
        </label>

           <Button id='imageUpload__btn' onClick={handleUpload}>
           Upload file
           </Button>

    </div>
)

}

export default ImageUpload;