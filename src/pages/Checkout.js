import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Card, Row, Col, Typography, Button, Form, Input } from 'antd';
import {getUserCart, saveUserAddress, getAddress} from "../functions/user";
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import {LoadingOutlined } from "@ant-design/icons";
import {toast} from "react-toastify";

const { Title } = Typography;

const Checkout = () =>{
    const { Search } = Input;
    const [form] = Form.useForm();
    const {cart, user} = useSelector((state) => ({...state}))
    const [products, setProducts] = useState([])
    const [cartTotal, setCartTotal] = useState(0);
    const [delivery, setDelivery] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [address, setAddress] = useState("")
    const [street1, setStreet1] = useState("")
    const [street2, setStreet2] = useState("")
    const [landmark, setLandmark] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [pincode, setPincode] = useState("")
    const [pincodeLoading, setPincodeLoading] = useState(false)
    const [pincodeError, setPincodeError] = useState("")
    const [pincodeSuccess, setPincodeSuccess] = useState(false)
    const [deliverbuttonclicked, setdeliveredButtonClicked] = useState(false)
    const [savetodb, setSavetodb] = useState(false)
    const [saveAddressSuccess, setSaveAddressSuccess] = useState(false);
    const [controlAPI, setControlAPI] = useState(false)
    const [parseOk, setParseOk] = useState(false)
    const [getAddressclicked, setgetAddressClicked] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if(!controlAPI){
        getUserCart(user.token)
        .then((res)=>{
            setProducts(res.data.products);
            setCartTotal(res.data.cartTotal)
            setDelivery(res.data.totalDelivery)
            setDiscount(res.data.totalDiscount)
            setControlAPI(true)
        })
        }
    })
    const onFinish = (values) => {
        console.log('Finish:', values);
    };
    
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
    //handlechange
    const handleStreet1 = (value) => {
        setStreet1(value)
    }
    const handleStreet2 = (value) => {
        setStreet2(value)
    }
    const handlelandmark = (value) => {
        setLandmark(value)
    }
    const handleCity = (value) => {
        setCity(value)
    }
    const handleState = (value) => {
        setState(value)
    }
    const handlePincode = (value) => {
        setPincode(value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setdeliveredButtonClicked(true)
        if(street2.length==0 || street1.length==0 || landmark.length==0 || pincode.length==0 || city.length==0 || state.length==0)
        {
            toast.error("All fields are required", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setdeliveredButtonClicked(false);
            return;
        }
        if(street2.includes("^") || street1.includes("^") || landmark.includes("^") || pincode.includes("^") || city.includes("^") || state.includes("^"))
        {
            toast.error(" ^ character is invalid for address", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setdeliveredButtonClicked(false);
            return;
        }
        setAddress(street1+ "^" + street2+"^"+ landmark+"^"+ city+"^"+state+"^"+pincode)
        setSavetodb(true)
    }
    //detect location
    const detectLocationFromPincode = value => {
        setPincodeSuccess(false);
        setPincode(value)
        setPincodeLoading(true)
        setPincodeError("");
            axios.get(`https://api.postalpincode.in/pincode/${value}`)
            .then(res => {
                if(res.data[0].Message === "No records found")
                {
                    setState("")
                    setCity("")
                    setPincodeError("No records found")
                }
                else{
                    setPincodeError("")
                    setState(res.data[0].PostOffice[0].State);
                    setCity(res.data[0].PostOffice[0].Block);
                    setPincodeSuccess(true);
                }
                setPincodeLoading(false);
            })
            .catch(err => {
                setPincodeError("Invalid PIN Code");
                setPincodeLoading(false);
            });
        
    }
    //payment option
    const paymentOption = () => {
        
    }
    //save address
    const saveAddressToDb = () =>{
        saveUserAddress(address,user.token)
        .then((res)=>{
            console.log(res.data)
            if(res.data.ok)
            {
                setSaveAddressSuccess(true);
                setdeliveredButtonClicked(false)
            }
        }).catch(err=>{
            toast.error(err, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setdeliveredButtonClicked(false)
            return;
        })
    }
    //update address button
    const handleUpdateAddress = (e) =>{
        e.preventDefault()
        setSaveAddressSuccess(false)
        setSavetodb(false)
    }
    //get address from db
    const getAddressfromDb = () => {
        setgetAddressClicked(true)
        getAddress(user.token)
        .then((res)=> {
            setAddress(res.data.address[0].address)
            setgetAddressClicked(false)
            setParseOk(true)
            
        })
    }
    //parse address 
    const parseAddress = (address) => {
        var splittedAddress = address.split("^")
        setStreet1(splittedAddress[0])
        setStreet2(splittedAddress[1])
        setLandmark(splittedAddress[2])
        setCity(splittedAddress[3])
        setState(splittedAddress[4])
        setPincode(splittedAddress[5])
        setSaveAddressSuccess(true);
        setPincodeSuccess(true)
        setPincodeError("")
        setParseOk(false)

    }
    return(
        <div className="container-fluid" style={{backgroundColor:"#eee", width:"100%", minHeight:"100vh"}}>
            <div className="row">
                <div className="col-md-8">
                    <div className="pt-2 pl-2 pb-2">
                        <Card title={<Title level={4}>Delivery Address</Title>} bordered={false} style={{ width: "100%", minHeight:"50vh"}}>
                        <Form name="address" onFinish={onFinish}>
                            <Row>
                                <Col offset={1} span={10}>
                                    <Form.Item rules={[{ required: true }]}>
                                    <Input placeholder="Street Address" value={street1} disabled={saveAddressSuccess} onChange={(e)=>handleStreet1(e.target.value)}/>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={10}>
                                    <Form.Item rules={[{ required: true }]}> 
                                    <Input placeholder="Street Address" value={street2} disabled={saveAddressSuccess} onChange={(e)=>handleStreet2(e.target.value)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={1} span={10}>
                                    <Form.Item rules={[{ required: true }]}>
                                    <Input placeholder="Landmark" value={landmark} disabled={saveAddressSuccess} onChange={(e)=>handlelandmark(e.target.value)}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={1} span={7}>
                                    <Form.Item rules={[{ required: true }]}>
                                    <Input name="city" placeholder="City" value={city} onChange={(e)=>handleCity(e.target.value)} disabled={pincodeSuccess || saveAddressSuccess} />
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={7}>
                                    <Form.Item rules={[{ required: true }]}>
                                    <Input placeholder="State" value={state} onChange={(e)=>handleState(e.target.value)} disabled={pincodeSuccess || saveAddressSuccess}/>
                                    </Form.Item>
                                </Col>
                                <Col offset={1} span={7}>
                                    <Form.Item rules={[{ required: true }]}>
                                    <Input.Search placeholder="Verify your Pincode" disabled={saveAddressSuccess} onChange={(e)=> handlePincode(e.target.value)} value={pincode} allowClear onSearch={detectLocationFromPincode}  />
                                    {pincodeLoading && (<LoadingOutlined style={{ fontSize: "12px" }} spin />)}
                                    {!pincodeLoading && pincodeError.length>0 && (<p style={{fontSize:"12px", color:"red"}}> {pincodeError}</p>)}

                                    </Form.Item>
                                </Col>
                            </Row>
                            {parseOk && parseAddress(address)}
                            <Row>
                            <Col offset={1} span={18}>
                            {!saveAddressSuccess && !deliverbuttonclicked && (
                                <>
                                <Button disabled={!products.length || !pincodeSuccess} onClick={handleSubmit} className="mt-4" type="primary">
                                Deliver Here</Button> 
                                <span className="ml-3" style={{cursor:"pointer", color:"blue"}} onClick={getAddressfromDb}> {getAddressclicked && (<LoadingOutlined className="mr-2"/>)}Use my last delivery location</span>
                                </>
                            )}
                            {deliverbuttonclicked && (
                                <Button  className="mt-4" type="light" icon = {<LoadingOutlined />}>
                                Please Wait..</Button> 
                            )}
                            {saveAddressSuccess && (
                                <Button onClick={handleUpdateAddress} className="mt-4" type="primary">
                                Update Address</Button> 
                            )}
                            </Col>
                            {savetodb && saveAddressToDb()}
                            </Row>
                            </Form>

                                

                            
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
                                    <Col span={12}> <Button disabled={!products.length || !saveAddressSuccess} className="mt-4" type="primary">
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