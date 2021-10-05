import React, {useEffect, useState} from "react";
import { Row, Card, Col, Input, Button, Collapse, Rate, Badge } from 'antd';
import {Link} from "react-router-dom";
import { HeartFilled, ShoppingCartOutlined,LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export const SingleProduct = ({product}) => {
    const { Search } = Input;
    const [loading, setLoading] = useState(false);
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [state, setState] = useState("");
    const [error, setError] = useState("");
    const {images } = product;
    const { Panel } = Collapse;



    const onSearch = value =>{
        setPincode(value);
        if (value.length !== 6) {
            setState("");
            setCity("");
            setDistrict("");
            setError("ZIP code must be of 6 digits")
        }
        if (value.length === 6) {
            setLoading(true)
            setError("");
            axios.get(`https://api.postalpincode.in/pincode/${value}`)
            .then(res => {
                console.log(res);
                setState(res.data[0].PostOffice[0].State);
                setCity(res.data[0].PostOffice[0].Block);
                setDistrict(res.data[0].PostOffice[0].District);
                setLoading(false);
            })
            .catch(err => {
                setError("Invalid PIN Code");
            });
        }
    };
    const updateRating = (value) =>{
        console.log(value);
    }
    return(
        <>
            <Col span={12} className="p-4" >
            <Carousel showArrows={true} autoPlay infiniteLoop>
                {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
            </Carousel>
            </Col>

            <Col span={12} className="p-4">
                <div className="text-secondary">
                    <Link to={`/category/product/search/${product.category._id}`} className="link1">{product.category.name}</Link> {`>`} 
                    <Link to={`/subcategory/product/search/${product.subcategory._id}`} className="link1"> {product.subcategory.name}</Link>
                </div>
                <div className="mt-2" style={{color: "#bfbfbf" ,fontSize:"16px",fontWeight:"bold"}}>{product.brand.name.toUpperCase()}</div>
                <div style={{fontFamily:"sans-serif", fontSize:"22px", fontWeight:"inherit"}} className="mt-1">{product.title}</div>
                <HeartFilled style={{fontSize:"40px" , color:"grey"}} className="p-2"/>
                <div className="mt-1" style={{fontFamily:"sans-serif", fontSize:"30px", fontWeight:"bold"}}>Rs. {product.price}</div>
                <div className="mt-1" >
                    <Rate defaultValue={0} allowClear={false} disabled onChange={(value) => updateRating(value)}/>
                    <br />
                    <Badge className="site-badge-count-5 mt-2" size="large" count={8.4} style={{ backgroundColor: '#52c41a' }} />
                </div>
                {parseInt(product.quantity) < 10 && (
                                    <div className="mt-1" style={{fontFamily:"sans-serif", fontSize:"15px", fontWeight:"bold", color:"red"}}>
                                        Hurry!! Only a few left
                                    </div>
                )}
                <div className="mt-3" style={{fontSize:"16px" , color:"grey"}}>Color: {product.color}</div>
                <div className="mt-3" style={{fontSize:"16px" , color:"grey"}}>Suitable For: {product.gender.toUpperCase()}</div>
                <Search placeholder="Enter your Pincode" allowClear onSearch={onSearch} style={{ width: 300 }} className="mt-3" />
                {pincode.length === 0 && (
                    <div className="mt-1" style={{fontFamily:"sans-serif", fontSize:"12px", fontWeight:"initial", color:"red"}}>
                        Please enter the pincode to check the delivery.
                    </div>
                )}
                {loading && (
                    <div className="mt-1" style={{fontFamily:"sans-serif", fontSize:"12px", fontWeight:"initial"}}>
                        <LoadingOutlined style={{ fontSize: "12px" }} spin />
                    </div>

                )}
                {error.length>0 && (
                    <div className="mt-1" style={{fontFamily:"sans-serif", fontSize:"12px", fontWeight:"initial", color:"red"}}>
                        Pincode must be of 6 digit
                    </div>

                )}
                {pincode.length>0 && city.length> 0 && (
                    <div className="mt-1" style={{fontFamily:"sans-serif", fontSize:"12px", fontWeight:"initial", color:"green"}}>
                        Pincode for {city} {district} {state} Verified Successfully.
                    </div>
                )}

                <Button 
                    //onClick={googleLogin}
                    type="danger"
                    shape="round"
                    className = "mt-4"
                    block
                    icon = {<ShoppingCartOutlined />}
                    style={{width:300}}
                    disabled={city.length<1}
                    size="large"
                >
                Add to Cart
                </Button>
            </Col>
            <div className ="container fluid mb-2">
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Product Description" key="1">
                    <p>{product.description}</p>
                </Panel>
            </Collapse>
            </div>
            
        </>
    )
};