import React,{useState, useEffect} from "react";
import register from "./register.png";
import { auth } from "../../firebase";
import {Link} from "react-router-dom";
import {Button} from "antd";
import { MailOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAuth, isSignInWithEmailLink, updatePassword, signInWithEmailLink } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {toast } from 'react-toastify';
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({history}) =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wait, setWait] = useState(false);
    const {user} = useSelector((state) => ({...state}))
    let dispatch = useDispatch();

    useState(() => {
        setEmail(window.localStorage.getItem("emailForRegistration"))
    },[history]);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        //validation
        if(!email)
        {
        toast.error('We are unable to fetch your email. Please restart your registration process and kindly use the same device to complete the registration', {
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
        if(!password)
        {
            toast.error('Password is required', {
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
        if(password.length < 6)
        {
            toast.error('Password must be 6 characters long', {
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

        try{
            setWait(true);
            const result = await signInWithEmailLink(auth, email, window.location.href);
            if(result.user.emailVerified){
                window.localStorage.removeItem('emailForRegistration');
                let user = auth.currentUser;
                await updatePassword(user, password);
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    dispatch({
                        type: "LOGGED_IN_USE",
                        payload: {
                            name: res.data.name,
                            email: res.data.email,
                            token: idTokenResult.token,
                            role: res.data.role,
                            _id: res.data._id,
                        },
                    });
                })
                .catch(err => console.log(err));
                history.push('/');

            }
        }catch(error)
        {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }



    }
    const completeRegisterForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} disabled style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px"}}/>
            <input type="password" className="form-control mt-3" value={password} onChange={e => setPassword(e.target.value)} autoFocus placeholder="Enter your password" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px"}}/>

            {!wait && (
                    <Button 
                    onClick={handleSubmit}
                    type="primary"
                    shape="round"
                    className = "mt-3"
                    block
                    icon = {<MailOutlined />}
                    size="large"
                >Complete Registration </Button>
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
                Please Wait....</Button>            )}
        </form>
        <Button 
                type="primary"
                style={{ background: "#e9af29", borderColor: "#e9af29" }}
                shape="round"
                className = "mt-3"
                block
                size="large"
                >
                <Link to="/login">Existing User? Login</Link></Button>
        </>
        
    );
    return(
        <div className="container p-5">
            <div className="row">
                <div className="col-xs-12 col-sm-8 col-md-4 p-5 column-margin" style={{backgroundColor:"#096dd9"}}>
                    <h2 style={{color:"white"}}>Looks like you are new here!</h2>
                    <h6 style={{color:"#d9d9d9"}}>Sign up with your email id to get started </h6>
                    <img src={register} style={{width:"60%"}} className= "mt-5 ml-2" />
                </div>

                <div className="col-xs-12 col-sm-8 col-md-6 p-5 offset-md-1">
                    <h1 className="p-2" style={{fontFamily:"Metropolis"}}>Complete Your Registration</h1>
                    {completeRegisterForm()}
                </div>
            </div>
        </div>
    )
}
export default RegisterComplete;