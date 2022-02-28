import React from "react";
import { Card, Typography, Col, Badge } from 'antd';
import {Link} from "react-router-dom";


const { Meta } = Card;

export const ProductCard = ({product}) => {
    var today = new Date();
    var createdDate = new Date(product.createdAt.substring(0,4), product.createdAt.substring(5,7)-1, product.createdAt.substring(8,10));
    var Difference_In_Time = today.getTime() - createdDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
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

    return(
        <>
            <Col span={4} key={product._id}>
            <Link to={`/product/${product.slug}`}>
            {Difference_In_Days < 2 && (
                <Badge.Ribbon text="New">
                <Card
                hoverable
                bordered={false}
                style={{ width: 240 }}
                className="p-3"
                cover={<img alt="example" src={product.images[0].url} />}
                >
                <Meta />
                <p style={{fontFamily:"sans-serif"}}><b>{product.title.substring(0,60)}...</b></p>
                <Badge className="site-badge-count-109" count={4.4} style={{ backgroundColor: '#52c41a' }} />
                {product.discount ? (
                    <>
                        <p>
                        <span style={{color:"black", fontSize:"15px", fontWeight:"bold"}}>₹{displayIndianFormat(product.price - product.discount)} </span>
                        <span className="ml-1" style={{color:"grey", fontSize:"14px"}}> <strike>₹{displayIndianFormat(product.price)}</strike> </span>
                        <span className="ml-1" style={{color:"green", fontSize:"12px", fontWeight:"bolder"}}> {calculateDiscountRate(product.price, product.discount)}% off</span>
                        </p>
                        
                    </>
                ) : (
                    <>
                    <p style={{color:"black", fontSize:"15px", fontWeight:"bold"}}>₹{displayIndianFormat(product.price)}</p>
                    </>
                )}
                </Card>
                </Badge.Ribbon>
            )}
            {Difference_In_Days >= 2 && (
                <Card
                hoverable
                bordered={false}
                style={{ width: 240 }}
                className="p-3"
                cover={<img alt="example" src={product.images[0].url} />}
                >
                <Meta />
                <p style={{fontFamily:"sans-serif"}}><b>{product.title.substring(0,60)}...</b></p>
                <Badge className="site-badge-count-109" count={4.4} style={{ backgroundColor: '#52c41a' }} />
                {product.discount ? (
                    <>
                        <p>
                        <span style={{color:"black", fontSize:"15px", fontWeight:"bold"}}>₹{displayIndianFormat(product.price - product.discount)} </span>
                        <span className="ml-1" style={{color:"grey", fontSize:"14px"}}> <strike>₹{displayIndianFormat(product.price)}</strike> </span>
                        <span className="ml-1" style={{color:"green", fontSize:"12px", fontWeight:"bolder"}}> {calculateDiscountRate(product.price, product.discount)}% off</span>
                        </p>
                        
                    </>
                ) : (
                    <>
                    <p style={{color:"black", fontSize:"15px", fontWeight:"bold"}}>₹{displayIndianFormat(product.price)}</p>
                    </>
                )}
                </Card>
            )}
            </Link>
            </Col>
        </>
    )
}
