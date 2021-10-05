import React from "react";
import { Card, Typography, Col, Badge } from 'antd';
import {Link} from "react-router-dom";


const { Meta } = Card;

export const SearchProductCard = ({product}) => {
    var today = new Date();
    var createdDate = new Date(product.createdAt.substring(0,4), product.createdAt.substring(5,7)-1, product.createdAt.substring(8,10));
    var Difference_In_Time = today.getTime() - createdDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return(
        <>
            <Col span={6} className="mt-2 mb-2" key={product._id}>
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
                <p style={{color:"grey"}}>Rs {product.price}</p>
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
                <p style={{color:"grey"}}>Rs {product.price}</p>
                </Card>
            )}
            </Link>
            </Col>
        </>
    )
}
