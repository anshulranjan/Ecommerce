import React, { useState, useEffect } from "react";
import { getProductsByCount, fetchByFilters } from "../../functions/product";
import { getCategories } from "../../functions/category";
import { useSelector, useDispatch } from "react-redux";
import { SearchProductCard } from "./SearchProductCard";
import {SearchLoadingCard} from "./SearchLoadingCard";
import { Menu, Slider, Row, Pagination, Checkbox } from 'antd';
import {CloseOutlined, DownSquareOutlined} from "@ant-design/icons";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [price, setPrice]= useState([0,0]);
    const [categories, setCategories] = useState([])
    const [categoryIds, setCategoryIds] = useState([]);
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
        getCategories().then((res) => setCategories(res.data));
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


    //load products based on categories

    const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

    const handleCheck = (e) => {
        dispatch({
          type: "SEARCH_QUERY",
          payload: { text: "" },
        });
        setPrice([0, 0]);
        // console.log(e.target.value);
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked); // index or -1
    
        // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
        if (foundInTheState === -1) {
          inTheState.push(justChecked);
        } else {
          // if found pull out one item from index
          inTheState.splice(foundInTheState, 1);
        }
    
        setCategoryIds(inTheState);
        // console.log(inTheState);
        fetchProducts({ category: inTheState });
      };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 p-4">
                    <Menu defaultOpenKeys={["1", "2"]} mode="inline">
                    <span className="h5">Filters</span>
                    {/* price*/}
                    <SubMenu key="1" title={<span className="h6">PRICE</span>}>
                        <div>
                            <Slider className="ml-4 mr-4" tipFormatter={(v) => `Rs. ${v}`} range value={price} onChange={handleSlider} max="200000" />
                        </div>
                    </SubMenu>

                    {/* categories */}
                    <SubMenu key="2" title={<span className="h6">CATEGORIES</span>}>
                        <div style={{ maringTop: "-10px" }}>{showCategories()}</div>
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