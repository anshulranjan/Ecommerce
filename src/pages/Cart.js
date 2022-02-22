import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import cartimage from "./cartImage.png";
import { Card, Row, Col, Typography, Button } from 'antd';
const { Title } = Typography;

const Cart = () =>{
    const {cart, user} = useSelector((state) => ({...state}))
    const dispatch = useDispatch();

    //total cost of items calculations
    const getTotalCartValue = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        },0)
    }

    const getDiscountValue = () => {
        var discount = 0
        cart.map((c,i) => {
            if(c.discount)
            {
                discount = discount + c.discount
            }
        })
        return discount;
    }
    const getDeliveryCharge = () =>
    {
        var delivery = 0
        cart.map((c,i) => {
            if(c.delivery)
            {
                delivery = delivery + c.delivery
            }
        })
        return delivery;
    }
    const getTotalAmount = () => {
        return getTotalCartValue() - getDiscountValue() + getDeliveryCharge();

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
                                
                                <Col span={8}><p style={{fontSize:"16px"}}> Price {cart.length === 1 ? (<> ({cart.length} item)</>) : (<> ({cart.length} items)</>)} </p></Col>
                                <Col span={8} offset={8}><p style={{fontSize:"16px"}}> Rs. {getTotalCartValue()}</p></Col>
                                <Col span={8}><p style={{fontSize:"16px"}}>Discount </p> </Col>
                                <Col span={8} offset={8}> <p style={{fontSize:"16px", color:"green"}}> - Rs. {getDiscountValue()} </p></Col>
                                <Col span={8}><p style={{fontSize:"16px"}}> Delivery Charges </p></Col>
                                <Col span={8} offset={8}>{getDeliveryCharge() === 0 ? (<><p style={{fontSize:"16px", color:"green"}}> FREE</p></>) : (<>
                                    <p style={{fontSize:"16px"}}> +  Rs. {getDeliveryCharge()} </p></>
                                )}</Col>
                                <Col span={8}><h3 className="pt-2" style={{fontSize:"20px"}}>Total Amount </h3> </Col>
                                <Col span={8} offset={8}> <h3 className="pt-2" style={{fontSize:"20px"}}> Rs. {getTotalAmount()} </h3></Col>


                                {user ? (
                                    <Col span={12}> <Button className="mt-4" type="primary">Proceed to Checkout</Button> </Col>                            
                                )
                                : (
                                    <Col span={12}><Button className="mt-4" type="primary">Login to Checkout</Button></Col>
                                )}
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