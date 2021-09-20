import React from "react";
import { Link } from "react-router-dom";

const UserNav = () => {
    return(
        <div id="sidebar">
            <ul className="nav flex-column">
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/user/history">
                 Order History
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/user/password">
                Password
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/user/wishlist">
                 Wishlist
                </Link>
            </li>
            </ul>
        </div>
)};

export default UserNav;