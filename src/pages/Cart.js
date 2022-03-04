import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import cartimage from "./cartImage.png";
import { Card, Row, Col, Typography, Button } from 'antd';
import ModalImage from 'react-modal-image';
import {toast} from "react-toastify";
import { userCart } from "../functions/user";

const { Title } = Typography;

const Cart = ({history}) =>{
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

    //handle quantity change
    const handleQuantityChange = (e, c) => {
        let count = e.target.value < 1 ? 1 : e.target.value
        if(count>c.quantity)
        {
            toast.error(`You can maximum order ${c.quantity} quantity of this item`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        let cart = []
        if(typeof window !== 'undefined')
        {
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if(product._id == c._id){
                    cart[i].count = parseInt(count);
                }
            });
            localStorage.setItem('cart',JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });
        }
    }
    //remove the items
    const handleRemove = (c) =>{
        let cart = []
        if(typeof window !== 'undefined')
        {
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if(product._id == c._id){
                    cart.splice(i,1);
                }
            });
            localStorage.setItem('cart',JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });
            toast.error(`Item removed successfully.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    //show cart items
    const showCartItems = () =>(
        <>
        {cart.map((c,i) =>{ 
            return (
            <>
            <Col className="mt-5" key ={i} span={3} style={{width:"100px", height:"auto"}}>
                {c.images.length ? (
                    <ModalImage small={c.images[0].url} large={c.images[0].url} />
                ) : (
                    <>
                    </>
                )}
            </Col>

            <Col className="mt-5 ml-4" span={14}>
                <div style={{fontFamily:"sans-serif", fontSize:"16px"}}><Link to={`/product/${c.slug}`} style={{color:"black"}}>{c.title.substring(0,60)}...</Link></div>
                <div style={{fontFamily:"sans-serif", fontSize:"14px", color:"grey"}}>{c.brand.name}</div>
                {c.discount ? (
                    <>
                        
                        <b style={{fontFamily:"sans-serif", fontSize:"18px"}} >₹{displayIndianFormat(c.price - c.discount)}</b>
                        <span className="ml-1" style={{color:"grey", fontSize:"14px"}}> <strike>₹{displayIndianFormat(c.price)}</strike> </span>
                        <span className="ml-2" style={{color:"green", fontSize:"14px", fontWeight:"bolder"}}> {calculateDiscountRate(c.price, c.discount)}% off</span>
                    </>
                ) : (
                    <>
                        <div style={{fontFamily:"sans-serif", fontSize:"18px"}}>
                        <b>₹{displayIndianFormat(c.price)}</b></div>
                    </>
                )}
                <Row className="mt-2" justify="space-between">
                    <Col span={8}>
                        <input type="number" className="form-control" value={c.count} onChange={(e)=>handleQuantityChange(e, c)} />
                    </Col>
                    <Col span={8}>
                        <h6 style={{color:"blue", "cursor":"pointer"}} onClick={() => handleRemove(c)}>REMOVE</h6>
                    </Col>
                </Row>
            </Col>

            <Col className="mt-5" span={6}>
                <p style={{fontSize:"14px"}}> Delivery Available | {c.delivery ? (
                    <>
                        <span>₹{displayIndianFormat(c.delivery)}</span>
                    </>
                ) : (
                    <span style={{color:"green", fontSize:"14px", fontWeight:"bolder"}}> FREE</span>
                )}</p>
            </Col>
            </>
        )})
        }
        </>
    )
    //save order to db
    const saveOrderToDb = () => {
        //check if asked quantity is available at time of checkout
        console.log(cart);
        userCart(cart,user.token)
        .then(res => {
            console.log(res);
            if (res.data.ok)
            {
                history.push("/checkout")
            }
        }).catch(err => console.log('cart save error',err))
    }
    return(
        <div className="container-fluid" style={{backgroundColor:"#eee", width:"100%", height:"100%"}}>
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
                                {showCartItems()}
                            </Row>
                        </Card>
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


                                {user ? (
                                    <Col span={12}> <Button onClick={saveOrderToDb} disabled={!cart.length} className="mt-4" type="primary">
                                        Proceed to Checkout</Button> 
                                    </Col>                            
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
            )}
        </div>
    )
}

export default Cart;