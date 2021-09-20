import React from "react";
import {Route , Link} from "react-router-dom";
import { useSelector } from "react-redux";

const UserRoute = ({childern, ...rest}) => {
    const {user} = useSelector((state) => ({...state}));
    return user && user.token ? (
    <Route {...rest} render={() => childern} /> 
    ):(
    <h1 className="text-danger"> Loading </h1>
    );
};
export default UserRoute;