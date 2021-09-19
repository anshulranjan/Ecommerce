import React,{useState, useEffect} from "react";
import register from "./register.png";
import { auth } from "../../firebase";
import {Link} from "react-router-dom";
import {toast } from 'react-toastify';
import { sendPasswordResetEmail } from "@firebase/auth";
import {Button} from "antd";
import { useSelector } from "react-redux";
import { MailOutlined, LoadingOutlined } from '@ant-design/icons';

const ForgotPassword = ({history}) =>{
    const [email, setEmail] = useState("");
    const [wait, setWait] = useState(false);
    const {user} = useSelector((state) => ({...state}))
    useEffect(() => {
        if(user && user.token) history.push("/")
    }, [user] );
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
        {
            toast.error('Invalid Email', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        setWait(true);
        const actionCodeSettings = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL ,
            handleCodeInApp: true
        }
        await sendPasswordResetEmail(auth, email, actionCodeSettings)
        .then(function() {
            setEmail("");
            setWait(false);
            toast.success(' Please check your email for password reset link', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
          })
          .catch((error) => {
            setWait(false);
            toast.error(error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        });
    }
    const forgotpassword = () => (
        <>
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus placeholder="Enter your email id" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px"}}/>
            {!wait && (
                <Button 
                onClick={handleSubmit}
                type="primary"
                shape="round"
                className = "mt-3"
                block
                icon = {<MailOutlined />}
                size="large"
                disabled = {!email}
            >
            Verify Email</Button>
            )}
            {wait && (
                <Button 
                type="primary"
                shape="round"
                className = "mt-3"
                block
                icon = {<LoadingOutlined />}
                size="large"
                >
                Please Wait....</Button>
            )}
        </form>
        <Button 
                type="primary"
                style={{ background: "#e9af29", borderColor: "#e9af29" }}
                shape="round"
                className = "mt-3"
                block
                size="large"
                >
                <a href="/login">Remembered Your Password? Login</a></Button>
        </>
    );
    return(
        <div className="container p-5">
            <div className="row">
                <div className="col-xs-12 col-sm-8 col-md-4 p-5 column-margin" style={{backgroundColor:"#096dd9"}}>
                    <h2 style={{color:"white"}}>Relax!! Its easy to reset Password </h2>
                    <h6 style={{color:"#d9d9d9"}}>Follow the steps and reset your password within minutes. </h6>
                    <img src={register} style={{width:"60%"}} className= "mt-5 ml-2" />
                </div>

                <div className="col-xs-12 col-sm-8 col-md-6 p-5 offset-md-1">
                    <h1 className="p-2" style={{fontFamily:"Metropolis"}}>Forgot Password</h1>
                    {forgotpassword()}
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;