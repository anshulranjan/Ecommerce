import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Card, Row, Col, Typography, Button } from 'antd';
import {getUserCart} from "../functions/user"
const { Title } = Typography;

const Checkout = () =>{
    const {cart, user} = useSelector((state) => ({...state}))
    const [products, setProducts] = useState([])
    const [cartTotal, setCartTotal] = useState(0);
    const [delivery, setDelivery] = useState(0)
    const [discount, setDiscount] = useState(0)
    const dispatch = useDispatch();
    useEffect(() => {
        getUserCart(user.token)
        .then((res)=>{
            console.log(res.data);
            setProducts(res.data.products);
            setCartTotal(res.data.cartTotal)
            setDelivery(res.data.totalDelivery)
            setDiscount(res.data.totalDiscount)
        })
    })
    
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
        <div className="container-fluid" style={{backgroundColor:"#eee", width:"100%", minHeight:"100vh"}}>
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
                <div className="col-md-4">
                    <div className="pt-2">
                        <Card title={<Title level={4}><p style={{color:"grey"}}> ORDER SUMMARY </p></Title>} bordered={false} style={{ width: "100%" }}>
                            <Row className="mb-4">
                                <h5>Products ({products.length})</h5>
                                <hr style={{width:"100%", color:"black"}}/>
                                {products.map((p,i) => (
                                    <div key={i}>
                                        <p>
                                            {p.product.title.substring(0,30)}.... X {p.count} = {" ₹"}
                                            {p.discount ? (displayIndianFormat((p.price * p.count) - (p.discount * p.count))) : 
                                            (displayIndianFormat(p.price * p.count))
                                            }
                                        </p>
                                    </div>
                                ))}
                                <hr style={{width:"100%", color:"black"}}/>
                            </Row>
                            <Row>
                                <Col span={8}><p style={{fontSize:"16px"}}> Price {products.length === 1 ? (<> ({products.length} item)</>) : (<> ({products.length} items)</>)} </p></Col>
                                <Col span={8} offset={8}><p style={{fontSize:"16px"}}> ₹{displayIndianFormat(cartTotal - discount)}</p></Col>
                                <Col span={8}><p style={{fontSize:"16px"}}>Coupon Discount </p> </Col>
                                <Col span={8} offset={8}> <p style={{fontSize:"16px", color:"green"}}> - ₹{displayIndianFormat(discount)} </p></Col>
                                <Col span={8}><p style={{fontSize:"16px"}}> Delivery Charges </p></Col>
                                <Col span={8} offset={8}>{delivery === 0 ? (<><p style={{fontSize:"16px", color:"green"}}> FREE</p></>) : (<>
                                    <p style={{fontSize:"16px"}}> +  ₹{displayIndianFormat(delivery)} </p></>
                                )}</Col>
                                <Col span={8}><h3 className="pt-2" style={{fontSize:"20px"}}>Total Amount </h3> </Col>
                                <Col span={8} offset={8}> <h3 className="pt-2" style={{fontSize:"20px"}}> ₹{displayIndianFormat(cartTotal- discount)} </h3></Col>
                                {user ? (
                                    <>
                                    <Col span={12}> <Button disabled={!products.length} className="mt-4" type="primary">
                                        Make Payment</Button> 
                                    </Col> 
                                    <Col span={12}> <Button danger disabled={!cart.length} className="mt-4" type="primary">
                                    Update Cart</Button> 
                                    </Col>
                                    </> 
                                                               
                                )
                                : (
                                    <Col span={12}><Button className="mt-4" type="primary">
                                        <Link to={{
                                            pathname: "/login",
                                            state: {from :"cart"},
                                        }}>
                                        Login to Checkout</Link></Button></Col>
                                )}
                            </Row>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Checkout;