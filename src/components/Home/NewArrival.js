import React, {useState, useEffect} from "react";
import { Card, Typography, Row, Pagination } from 'antd';
import { ProductCard } from "./ProductCard";
import {toast} from "react-toastify";
import { getProducts } from "../../functions/product";
import { LoadingCard } from "./LoadingCard";
const { Title } = Typography;

export const NewArrival = () =>{
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proCount, setProCount] = useState(12);
    const [page, setPage] = useState(1);
    const arr = new Array(6);
    var elements=[];
    useEffect(() => {
        loadAllProducts();
    }, [page]);
    const loadAllProducts = () => {
        setLoading(true);
        getProducts('createdAt',"desc", page)
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
        <>
        <div className="p-2">
            <Card title={<Title level={2}>New Arrivals</Title>} bordered={false} style={{ width: "100%" }}>
                <Row>
                    {!loading && products.map((product) => 
                        (
                            <ProductCard product={product}/>
                        )
                        )}
                    { loading &&  elements}
                </Row>
                <div className="row">
                    <nav className="col-md-4 offset-md-4 text center mt-1 p-1">
                        <Pagination current={page} total = {(proCount/6) * 10} onChange = {(value) => setPage(value)}/>
                    </nav>
                </div>
            </Card>
        </div>
        </>
    )
}
