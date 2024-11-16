import * as React from "react";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({setIsLoggedIn}:any) => {
    const handleSuccess = (credentialResponse:any) => {
        console.log(credentialResponse);
        setIsLoggedIn(true);
      };
      const handleError = () => {
        console.log('Login Failed');
      };
  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default Login;
