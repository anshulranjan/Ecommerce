import React, { useState, useEffect } from "react";
import { getProductsByCount, fetchByFilters } from "../../functions/product";
import { useSelector, useDispatch } from "react-redux";
import { SearchProductCard } from "./SearchProductCard";
import {SearchLoadingCard} from "./SearchLoadingCard";
import { Menu, Slider, Row, Pagination } from 'antd';
import {CloseOutlined} from "@ant-design/icons";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [price, setPrice]= useState([0,0]);
    const [ok, setOk] = useState(false);
    let dispatch = useDispatch();
    const {search} = useSelector((state)=> ({... state}));
    const {text} = search;
    const {SubMenu, ItemMenu} = Menu;
    const arr = new Array(4);
    var elements=[];
    for(var i=0;i<arr.length;i++){
        elements.push(
            <SearchLoadingCard i = {i} />
            );
    }
    useEffect(() => {
        loadAllProducts();
    },[]);

    const loadAllProducts = () =>{
        getProductsByCount(12).then((res)=>{
            setProducts(res.data);
            setLoading(false);
        })
    };

    //load product on user search input
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProductByFilters({query:text});
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    const fetchProductByFilters = (text) => {
        setLoading(true);
        if(text.query.length == 0)
        {
            console.log("Hello");
            loadAllProducts();
        }
        else{
            fetchByFilters(text)
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            });
        }
    };

    //load products with price
    useEffect (() => {
        fetchProducts({price});

    },[ok])

    const handleSlider = (value) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload:{ text: "" }
        });
        setPrice(value);
        setTimeout(() => {
            setOk(!ok);
        },300)
    }

    const fetchProducts = (arg) => {
        fetchByFilters(arg).then((res) => {
          setProducts(res.data);
          setLoading(false);
        });
      };

    


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 p-4">
                    <Menu defaultOpenKeys={["1"]} mode="inline">
                    <span className="h5">Filters</span>
                    <SubMenu key="1" title={<span className="h6">PRICE</span>}>
                        <div>
                            <Slider className="ml-4 mr-4" tipFormatter={(v) => `Rs. ${v}`} range value={price} onChange={handleSlider} max="200000" />
                        </div>
                    </SubMenu>
                    </Menu>
                </div>




                <div className="col-md-9">
                    <h4 className="p-4">Products</h4>
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
                </div>
            </div>

        </div>
    )

};
export default Shop;