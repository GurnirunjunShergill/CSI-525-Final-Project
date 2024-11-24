import * as React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import {auth} from '../../../firebase';

const Login = ({ setIsLoggedIn, setUserData }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSuccess = (credentialResponse: any) => {
    console.log(credentialResponse);
    setIsLoggedIn(true);
  };
  const handleError = () => {
    console.log("Login Failed");
  };


  const login = async (event:any) => {
    event.preventDefault();
    const token = await auth.currentUser.getIdToken();
    console.log(token)

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });

    if(response.status === 200){
      const data = await response.json();
      setUserData({
        email: email,
        password: password,
        userName: data.username
      })
      setIsLoggedIn(true);
    }else if(response.status === 400){
      console.log('login failed handle that here')
    }
  };

  return (
    <>
      <form>
        <label>email</label>
        <input onChange={(event) => setEmail(event.target.value)} />
        <label>password</label>
        <input onChange={(event) => setPassword(event.target.value)} />
        <button onClick={login}>submit</button>
      </form>
      <p>or</p>
      {/* <GoogleLogin onSuccess={handleSuccess} onError={handleError} /> */}
    </>
  );
};

export default Login;
