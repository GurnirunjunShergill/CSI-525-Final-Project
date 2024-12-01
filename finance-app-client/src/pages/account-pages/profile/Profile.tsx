import * as React from "react";
import { useState } from "react";
import { auth } from "../../../firebase";

const Profile = ({ setUserData, userData,}:any) =>{
    const [username, setUsername] = useState(userData.username)
    const [password, setPassword] = useState(userData.password)

    const updateProfile = async (event:any) =>{
        event.preventDefault();
        const token = await auth.currentUser.getIdToken();
        
        const response = await fetch('http://localhost:3000/update-user', {
            method: 'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
            body: JSON.stringify({email: userData.email, username, password})
        })

        if(response.status === 200){
            const data = await response.json();
            console.log(data)
            setUserData({
                email: userData.email,
                password: password,
                username: username
              })
        }else if(response.status === 400){
            const data = await response.json();
            console.log(response, data)
            console.log('login failed handle that here')
        }
    }

    const deleteUser = async(event:any) =>{
        event.preventDefault();
        const token = await auth.currentUser.getIdToken();
        
        const response = await fetch('http://localhost:3000/delete-user', {
            method: 'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
            body: JSON.stringify({email: userData.email})
        })

        if(response.status === 200){
            const data = await response.json();
            console.log(data);
            location.reload();
        }else if(response.status === 400){
            const data = await response.json();
            console.log(response, data)
            console.log('login failed handle that here')
        }
    }

    return(
        <div className="profile-page">
            <form>
                <label>
                    email:
                </label>
                <input disabled value={userData.email} type='text'/>
                <label>
                    username:
                </label>
                <input value={username} onChange={(event)=>setUsername(event.target.value)} type='text'/>
                <label>
                    password:
                </label>
                <input value={password} onChange={(event)=>setPassword(event.target.value)} type='text'/>
                <input onClick={updateProfile} type='submit'/>
            </form>
            <button onClick={deleteUser}>Delete User</button>
        </div>
    )
}

export default Profile;