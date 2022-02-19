import React, { useState, useEffect } from "react";
import { extractTheSubsProduct } from "../../functions/product";
import { SearchProductCard } from "./SearchProductCard";
import {SearchLoadingCard} from "./SearchLoadingCard";
import { getSubCategoryById, getSubCategories } from "../../functions/subcategory";
import { Row, Pagination, Input } from 'antd';
import {CloseOutlined} from "@ant-design/icons";
import { Link } from "react-router-dom";
const ShowSubCategoryProduct = ({match}) => {
    const { Search } = Input;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proCount, setProCount] = useState("");
    const [subcatname, setSubCat] = useState("");
    const [search, setSearch] = useState("");
    const [subs, setSubs] = useState([]);

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
        getSubCategories().then((res) => setSubs(res.data));
    },[page, subid]);

    const loadAllProducts = () =>{
        setLoading(true);
        getSubCategoryById(subid).then((res)=>{
            setSubCat(res.data.name);
        })
        extractTheSubsProduct(subid,page).then((res)=>{
            setProducts(res.data.products);
            setProCount(res.data.count);
            setLoading(false);
        })
    };
    const showSubCategories = () =>
        subs.filter(searched(search)).map((c) => (
        <div key={c._id}
            className="p-1 m-1 badge badge-secondary"
            style={{cursor:"pointer"}}
            >
            <Link to ={`/subcategory/product/search/${c._id}`} style={{"color":"black"}}><h6>{c.name} </h6></Link>
        </div>
        ));
    const searched = (search) => (c) => c.name.toLowerCase().includes(search);
    const onSearch = value => {
        setSearch(value.toLowerCase());
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <h4 className="m-3">Sub Categories</h4>
                    <Search placeholder="Find Sub-Category" allowClear onSearch={onSearch} style={{ width: 300 }} className="m-2" />
                        <div style={{ maringTop: "-10px", "height":"500px","overflow":"scroll" }}>{showSubCategories()}</div>
                </div>
                <div className="col-md-9">
                    {!loading && (
                        <h3 className="p-3">
                            All Products of "{subcatname}" Sub-Category
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
export default ShowSubCategoryProduct;