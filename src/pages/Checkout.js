import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Typography, Button } from 'antd';
const { Title } = Typography;

const Checkout = () =>{
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
                discount = discount + c.discount * c.count
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
                delivery = delivery + c.delivery * c.count
            }
        })
        return delivery;
    }
    const getTotalAmount = () => {
        return getTotalCartValue() - getDiscountValue() + getDeliveryCharge();

    }

    //calculate discount rate
    const calculateDiscountRate = (c, d) =>{
        return Number(((d/c)*100).toFixed(0));
    }
    //indian format number display
    const displayIndianFormat = (x) =>{
        x=x.toString();
        var lastThree = x.substring(x.length-3);
        var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res;
    }
    //payment option
    const paymentOption = () => {
        
    }
    return(
        <div className="container-fluid" style={{backgroundColor:"#eee", width:"100%", height:"100%"}}>
            <div className="row">
                <div className="col-md-8">
                    <div className="pt-2 pl-2 pb-2">
                        <Card title={<Title level={4}>My  Cart ({cart.length})</Title>} bordered={false} style={{ width: "100%" }}>
                            <Row>
                                Hello
                            </Row>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                    <div className="pt-2">
                        <Card title={<Title level={4}><p style={{color:"grey"}}> PRICE DETAILS </p></Title>} bordered={false} style={{ width: "100%" }}>
                            <Row>
                                
                                <Col span={8}><p style={{fontSize:"16px"}}> Price {cart.length === 1 ? (<> ({cart.length} item)</>) : (<> ({cart.length} items)</>)} </p></Col>
                                <Col span={8} offset={8}><p style={{fontSize:"16px"}}> ₹{displayIndianFormat(getTotalCartValue())}</p></Col>
                                <Col span={8}><p style={{fontSize:"16px"}}>Discount </p> </Col>
                                <Col span={8} offset={8}> <p style={{fontSize:"16px", color:"green"}}> - ₹{displayIndianFormat(getDiscountValue())} </p></Col>
                                <Col span={8}><p style={{fontSize:"16px"}}> Delivery Charges </p></Col>
                                <Col span={8} offset={8}>{getDeliveryCharge() === 0 ? (<><p style={{fontSize:"16px", color:"green"}}> FREE</p></>) : (<>
                                    <p style={{fontSize:"16px"}}> +  ₹{displayIndianFormat(getDeliveryCharge())} </p></>
                                )}</Col>
                                <Col span={8}><h3 className="pt-2" style={{fontSize:"20px"}}>Total Amount </h3> </Col>
                                <Col span={8} offset={8}> <h3 className="pt-2" style={{fontSize:"20px"}}> ₹{displayIndianFormat(getTotalAmount())} </h3></Col>
                                    <Col span={12}> <Button onClick={paymentOption} disabled={!cart.length} className="mt-4" type="primary">
                                        Proceed to Payment</Button> 
                                    </Col>                            
                            </Row>
                        </Card>
                    </div>
                </div>

        </div>
    )

}

export default Checkout;