import React, {useState, useEffect} from "react";
import { Card, Typography, Row, Pagination } from 'antd';
import {toast} from "react-toastify";
import { LoadingCard } from "../Home/LoadingCard";
import { productsWithSubCategory } from "../../functions/product";
import { ProductCard } from "../Home/ProductCard";
const { Title } = Typography;

export const SimilarProducts = ({product}) =>{
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const arr = new Array(6);
    var elements=[];
    useEffect(() => {
        loadAllProducts();
    }, [product]);
    const loadAllProducts = () => {
        setLoading(true);
        productsWithSubCategory(product._id)
        .then(res => {
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
        <div className="p-2" key={product._id}>
            <Card title={<Title level={2}>Similar Products</Title>} bordered={false} style={{ width: "100%" }}>
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
