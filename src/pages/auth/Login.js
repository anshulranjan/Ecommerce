import React,{useState} from "react";
import register from "./register.png";
import { auth } from "../../firebase";
import {Link} from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import {toast } from 'react-toastify';
import {Button} from "antd";
import {LoginOutlined, LoadingOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";

const Login = ({history}) =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wait, setWait] = useState(false);
    let dispatch = useDispatch();
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
        try{
            setWait(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            const {user} = result;
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type: "LOGGED_IN_USE",
                payload: {
                  email: user.email,
                  token: idTokenResult.token,
                },
            })
            history.push("/");
        }
        catch(error){
            console.log(error);
            toast.error(error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setWait(false);
        }
    };
    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then(async (result) => {
            const {user} = result;
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type: "LOGGED_IN_USE",
                payload: {
                  email: user.email,
                  token: idTokenResult.token,
                },
            })
            history.push("/");
          })
          .catch((error) =>
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
          });
    }
    const loginForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus placeholder="Enter your email id" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px"}}/>
            <input type="password" className="form-control mt-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px"}}/>
            {!wait && (
                <Button 
                    onClick={handleSubmit}
                    type="primary"
                    shape="round"
                    className = "mt-3"
                    block
                    icon = {<LoginOutlined />}
                    size="large"
                    disabled = {!email || password.length < 6 }
                >
                Login</Button>
            )}
            {wait && (
                <Button 
                type="light"
                shape="round"
                className = "mt-3"
                block
                icon = {<LoadingOutlined />}
                size="large"
            >
            Please Wait...</Button>
            )}
        </form>
        <Button 
                    onClick={googleLogin}
                    type="danger"
                    shape="round"
                    className = "mt-3"
                    block
                    icon = {<GoogleOutlined />}
                    size="large"
                >
                Login with Google</Button>
        <Button 
                type="primary"
                style={{ background: "#e9af29", borderColor: "#e9af29" }}
                shape="round"
                className = "mt-3"
                block
                size="large"
                ><Link to="/register">New User? Create an Account</Link></Button>
        </>
        
    );
    return(
        <div className="container p-5">
            <div className="row">
                <div className="col-xs-12 col-sm-8 col-md-4 p-5 column-margin" style={{backgroundColor:"#096dd9"}}>
                    <h2 style={{color:"white"}}>Login to the ShopMe.</h2>
                    <h6 style={{color:"#d9d9d9"}}>Get access to your Orders, Wishlist and Recommendations </h6>
                    <img src={register} style={{width:"60%"}} className= "mt-5 ml-2" />
                </div>

                <div className="col-xs-12 col-sm-8 col-md-4 p-5 offset-md-1">
                    <h1 className="p-2" style={{fontFamily:"Metropolis"}}>Login</h1>
                    {loginForm()}
                </div>
            </div>
        </div>
    )
}
export default Login;