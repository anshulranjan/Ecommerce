import React, { useState, useEffect } from "react";
import { extractTheCategoryProduct } from "../../functions/product";
import { getCategoryById, getCategories } from "../../functions/category";
import { SearchProductCard } from "./SearchProductCard";
import {SearchLoadingCard} from "./SearchLoadingCard";
import { Card, Typography, Row, Pagination } from 'antd';
import {CloseOutlined} from "@ant-design/icons";
import { Link } from "react-router-dom";

const ShowCategoryProduct = ({match}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proCount, setProCount] = useState("");
    const [page, setPage] = useState(1);
    const [catname, setCatName] = useState("");
    const [categories, setCategories] = useState([]);
    const {catid} = match.params;
    const arr = new Array(4);
    var elements=[];
    for(var i=0;i<arr.length;i++){
        elements.push(
            <SearchLoadingCard i = {i} />
            );
    }
    useEffect(() => {
        loadAllProducts();
        getCategories().then((res) => setCategories(res.data));
    },[page, catid]);

    const loadAllProducts = () =>{
        setLoading(true);
        getCategoryById(catid).then((res)=>{
            setCatName(res.data.name);
        })
        extractTheCategoryProduct(catid,page).then((res)=>{
            setProducts(res.data.products);
            setProCount(res.data.count);
            setLoading(false);
        })
    };
    const showCategories = () =>
        categories.map((c) => (
        <div key={c._id}
            className="p-2 m-2"
            style={{cursor:"pointer"}}
        >
        <Link to ={`/category/product/search/${c._id}`} style={{"color":"black"}}><h6>{c.name} </h6></Link>
        </div>
    ));

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <h4 className="m-3">Categories</h4>
                    <div style={{ maringTop: "-10px", "height":"500px","overflow":"scroll" }}>{showCategories()}</div>
                </div>
                <div className="col-md-9">
                    {!loading && (
                        <h3 className="p-3">
                            All Products of "{catname}" Category
                        </h3>
                    )}
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
export default ShowCategoryProduct;