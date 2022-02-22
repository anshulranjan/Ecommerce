import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import cartimage from "./cartImage.png";
import { Card, Row, Typography } from 'antd';
const { Title } = Typography;

const Cart = () =>{
    const {cart, user} = useSelector((state) => ({...state}))
    const dispatch = useDispatch();
    //total cost of items
    const getTotalCartValue = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        },0)
    }
    return(
        <div className="container-fluid" style={{backgroundColor:"#eee", width:"100%", height:"100vh"}}>
            {!cart.length ? (
                <>
                    <div className="p-2">
                        <Card title={<Title level={4}>My  Cart</Title>} bordered={false} style={{ width: "100%" }}>
                            <Row>
                                <div className="text-center">
                                <img src={cartimage} alt="" style={{width:"30%", height:"55%"}} className= "m-1" />  
                                <br />
                                <h2>Your Cart is empty! </h2>
                                <Link to="/shop"><h4 style={{color:"blue"}}>Shop Now</h4></Link>
                                </div>
                            </Row>
                        </Card>
                    </div>
                </>
            ): (
            <div className="row">
                <div className="col-md-8">
                    <div className="pt-2 pl-2 pb-2">
                        <Card title={<Title level={4}>My  Cart ({cart.length})</Title>} bordered={false} style={{ width: "100%" }}>
                            <Row>
                                <div className="text-center">
                                <img src={cartimage} alt="" style={{width:"30%", height:"55%"}} className= "m-1" />  
                                <br />
                                <h2>Your Cart is empty! </h2>
                                <Link to="/shop"><h4 style={{color:"blue"}}>Shop Now</h4></Link>
                                </div>
                            </Row>
                        </Card>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="pt-2">
                        <Card title={<Title level={4}><p style={{color:"grey"}}> PRICE DETAILS </p></Title>} bordered={false} style={{ width: "100%" }}>
                            <Row>
                                <p> Price ({cart.length} items)</p> Rs. {getTotalCartValue()}
                                <p> Discounts ({cart.length} items)</p>
                                <p> Delivery Charges ({cart.length} items)</p>
                            </Row>
                        </Card>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default Cart;