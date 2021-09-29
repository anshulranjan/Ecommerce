import React, {useState, useEffect} from "react";
import { Card, Typography, Row } from 'antd';
import { ProductCard } from "./ProductCard";
import {toast} from "react-toastify";
import { getProducts } from "../../functions/product";
import { LoadingCard } from "./LoadingCard";
const { Title } = Typography;

export const BestSeller = () =>{
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const arr = new Array(6);
    var elements=[];
    useEffect(() => {
        loadAllProducts();
    }, []);
    const loadAllProducts = () => {
        getProducts('sold',"desc", 12)
        .then(res => {
            console.log(res.data);
            setProducts(res.data);
            setLoading(false);
        })
        .catch(err =>{
                    toast.error(err.response.data, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
        })
    }
    for(var i=0;i<arr.length;i++){
        elements.push(
            <LoadingCard i = {i} />
            );
    }

    return(
        <div className="p-2">
            <Card title={<Title level={2}>Best Sellers</Title>} bordered={false} extra={<a href="#">View All</a>} style={{ width: "100%" }}>
                <Row>
                    {!loading && products.map((product) => 
                        (
                            <ProductCard product={product}/>
                        )
                        )}
                    { loading &&  elements}
                </Row>
            </Card>
        </div>
    )
}
