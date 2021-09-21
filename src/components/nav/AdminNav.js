import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
    return(
        <div id="sidebar">
            <ul className="nav flex-column">
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/dashboard">
                 Dashboard
                </Link>
            </li>

            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/product">
                 Product
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/products">
                 Products
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/category">
                 Category
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/sub">
                 Sub Category
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/brand">
                 Brand
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/coupon">
                 Coupon
                </Link>
            </li>
            <li className="mt-3" style={{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/user/password">
                Password
                </Link>
            </li>
            </ul>
        </div>
)};

export default AdminNav;