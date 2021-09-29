import React from "react";
import { Card, Typography, Col, Badge } from 'antd';
import {Link} from "react-router-dom";


const { Meta } = Card;

export const ProductCard = ({product}) => {
    return(
        <>
            <Col span={4} key={product._id}>
            <Link to={`/admin/products`}>
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
            <p style={{color:"grey"}}>Rs {product.price}</p>
            </Card>
            </Badge.Ribbon>
            </Link>
            </Col>
        </>
    )
}
