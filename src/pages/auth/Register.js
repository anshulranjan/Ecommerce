import React,{useState} from "react";
import register from "./images.png";
import { auth } from "../../firebase";
import {Link} from "react-router-dom";
import { sendSignInLinkToEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () =>{
    const [email, setEmail] = useState("");
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const config = {
            url:'http://localhost:3000/register/complete',
            handleCodeInApp: true
        }
        await sendSignInLinkToEmail(auth, email, config)
        toast.success('🦄 The signIn link has been sent to your mail Id. Please check your mail', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        window.localStorage.setItem('emailForRegistration', email);
        setEmail("");
    }
    const registerForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus placeholder="Enter your email id" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px"}}/>
            <button type="submit" className="btn btn-primary mt-3">Register</button>
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

                <div className="col-md-4 offset-md-1">
                    <h1 className="p-2" style={{fontFamily:"Metropolis"}}>Register</h1>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        />
                    <ToastContainer />
                    {registerForm()}
                </div>
            </div>
        </div>
    )
}
export default Register;