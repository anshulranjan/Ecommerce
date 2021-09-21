import React from "react";
import { Link } from "react-router-dom";
const isActive = (path) => {
    if(window.location.href.split(process.env.REACT_APP_URL)[1] === path)
    {
        return {backgroundColor:"#d9d9d9"};
    }
}
const AdminNav = () => {
    return(
        <div id="sidebar">
            <ul className="nav flex-column">
            <div style={isActive("/admin/dashboard")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/dashboard">
                 Dashboard
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/product")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/product">
                 Product
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/products")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/products">
                 Products
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/category")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/category">
                 Category
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/sub")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/sub">
                 Sub Category
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/brand")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/brand">
                 Brand
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/coupon")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/admin/coupon">
                 Coupon
                </Link>
            </li>
            </div>
            <div style={isActive("/admin/password")}>
            <li className="mt-3 mb-3" style = {{fontFamily:"BlinkMacSystemFont", fontSize:"25px"}} >
                <Link to="/user/password">
                Password
                </Link>
            </li>
            </div>
            </ul>
        </div>
)};

export default AdminNav;