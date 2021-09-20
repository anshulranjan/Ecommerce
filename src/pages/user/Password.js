import React, {useState} from "react";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
import { updatePassword } from "firebase/auth";
import {toast} from "react-toastify";
import {Button} from "antd";
import { Input } from 'antd';
import {LoginOutlined, LoadingOutlined} from '@ant-design/icons';
const Password = () => {
    const [password, setPassword] = useState("");
    const [wait, setWait] = useState(false);
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setWait(true);
        await updatePassword(auth.currentUser, password)
        .then(() => {
            setWait(false);
            setPassword("");
            toast.success('Password Updated Successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        })
        .catch((err) => {
            setWait(false)
            toast.error(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        })


    }
    const passwordUpdateForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <Input.Password className="mt-3 mb-3" autoFocus value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter new password" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"50%"}}/>
            <br />
            {!wait && (
                <Button 
                    onClick={handleSubmit}
                    type="primary"
                    shape="round"
                    className = "mt-3"
                    block
                    icon = {<LoginOutlined />}
                    size="large"
                    disabled = {password.length < 6 }
                    style={{width:"50%"}}
                >
                Update the password</Button>
            )}
            {wait && (
                <Button 
                type="light"
                shape="round"
                className = "mt-3"
                block
                icon = {<LoadingOutlined />}
                size="large"
                style={{width:"50%"}}
            >
            Please Wait...</Button>
            )}
        </form>
        </>

    )
    return(
        <div id="viewport">
            <UserNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Update Password</h1>
                    {passwordUpdateForm()}
                </div>
            </div>
            </div>
    )

}
export default Password;

