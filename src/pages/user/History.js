import React from "react";
import UserNav from "../../components/nav/UserNav";
const History = () => {
    return(
    <div style={{backgroundColor:"#F5F5F5", height:"100%"}}>
    <div className="container fluid">
        <div className="row">
            <div className="col md-2 site-card-border-less-wrapper mt-3">
            <UserNav />
            </div>
            <div className="col">User History</div>
        </div>
    </div>
    </div>
    )

}
export default History;