import React, { useState, useEffect } from "react";
import { extractTheSubsProduct } from "../../functions/product";
import { SearchProductCard } from "./SearchProductCard";
import {SearchLoadingCard} from "./SearchLoadingCard";
import { Card, Typography, Row, Pagination } from 'antd';
import {CloseOutlined} from "@ant-design/icons";

const ShowSubCategoryProduct = ({match}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proCount, setProCount] = useState(12);
    const [page, setPage] = useState(1);
    const {subid} = match.params;
    const arr = new Array(4);
    var elements=[];
    for(var i=0;i<arr.length;i++){
        elements.push(
            <SearchLoadingCard i = {i} />
            );
    }
    useEffect(() => {
        loadAllProducts();
    },[page]);

    const loadAllProducts = () =>{
        extractTheSubsProduct(subid,page).then((res)=>{
            setProducts(res.data);
            setLoading(false);
        })
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    Search/Filter Menu
                </div>
                <div className="col-md-9">
                    <Row>
                    { loading &&  elements}
                    {!loading && products.length<1 && 
                        <h2 className="m-4 p-4 float-centre">
                            Sorry No Products Found
                        </h2>
                    }
                    {!loading && products.length>0 && products.map((product) => (
                            <SearchProductCard product={product}/>
                        ))
                    }
                    </Row>
                    <div className="row">
                        <nav className="col-md-4 offset-md-4 text center pt-5 p-3">
                            <Pagination current={page} total = {(proCount/12) * 10} onChange = {(value) => setPage(value)}/>
                        </nav>
                    </div>
                </div>
            </div>
            

        </div>
    )

};
export default ShowSubCategoryProduct;