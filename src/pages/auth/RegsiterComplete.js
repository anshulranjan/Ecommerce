import React,{useState, useEffect} from "react";
import register from "./register.png";
import { auth } from "../../firebase";
import {Link} from "react-router-dom";
import { getAuth, isSignInWithEmailLink, updatePassword, signInWithEmailLink } from "firebase/auth";
import {toast } from 'react-toastify';

const RegisterComplete = ({history}) =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wait, setWait] = useState(false);

    useState(() => {
        setEmail(window.localStorage.getItem("emailForRegistration"))
    },[]);

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
                <button type="submit" className="btn btn-primary mt-3">Complete Registration</button>
            )}
            {wait && (
                <p className="btn btn-light mt-3">Please Wait....</p>
            )}
        </form>
        <Link to="/login" className="btn btn-warning mt-3">Existing User? Login</Link>
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

                <div className="col-xs-12 col-sm-8 col-md-4 p-5 offset-md-1">
                    <h1 className="p-2" style={{fontFamily:"Metropolis"}}>Complete Your Registration</h1>
                    {completeRegisterForm()}
                </div>
            </div>
        </div>
    )
}
export default RegisterComplete;