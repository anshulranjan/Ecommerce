import React, {useEffect, useState} from "react";
import {Route} from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../functions/auth";
const AdminRoute = ({childern, ...rest}) => {
    const {user} = useSelector((state) => ({...state}));
    const [ok, setOk] = useState(false);
    useEffect(() => {
        if(user && user.token) {
            currentAdmin(user.token)
            .then(res => {
                setOk(true);
            })
            .catch((err) => {
                setOk(false);
                console.log(err.message);
            })

        }
    },[user])
    return ok ? (
    <Route {...rest} /> 
    ):(
        <LoadingToRedirect />
    );
};
export default AdminRoute;