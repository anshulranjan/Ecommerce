import React, {useEffect, useState} from "react";
import {Drawer, Button, Space} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {Link} from "react-router-dom";

const SideDrawer = ({children}) => {
    const dispatch = useDispatch();
    const {drawer, cart} = useSelector((state) => ({...state}));
    const onClose = () => {
        dispatch({
            type:"SET_VISIBLE",
            payload: false,
        })
    };
    const imageStyle = {
        width:"50%",
        height: "100px",
        objectFit: "cover"
    }

    return (
        <Drawer
        className="text-center"
        visible={drawer}
        onClose={onClose}
        title={`My Cart (${cart.length})`}
        width={400}
      >
        {cart.map((p,i) =>{
            return(
            <div className="row mt-3" key = {i}>
                <div className="col">
                    {p.images[0] ? (
                        <>
                        <img src={p.images[0].url} style={imageStyle} />
                        <br />
                        <p className="pt-1">{p.title.substring(0,60)}</p>
                        </>
                    ):(
                        <></>
                    )}
                </div>
            </div>
        )})}
        <Button onClick={() =>{
            dispatch({
                type:"SET_VISIBLE",
                payload: false,
            })
        }} 
        className="mt-2" 
        type="primary" 
        style={{width:"100%"}}>
            <Link to="/cart">
                Go To Cart
            </Link>        
        </Button>
        
      </Drawer>
    )

}

export default SideDrawer;