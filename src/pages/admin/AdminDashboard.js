import React, {useState} from "react";
import AdminNav from "../../components/nav/AdminNav";

const AdminDashboard = () => {
    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Admin DashBoard</h1>
                </div>
            </div>
            </div>
    )

}
export default AdminDashboard;

