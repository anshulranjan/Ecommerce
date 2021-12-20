import React, { useState, useEffect } from "react";
import { getProductsByCount, fetchByFilters } from "../../functions/product";
import { getSubCategories } from "../../functions/subcategory";
import { getCategories } from "../../functions/category";
import { useSelector, useDispatch } from "react-redux";
import { SearchProductCard } from "./SearchProductCard";
import {SearchLoadingCard} from "./SearchLoadingCard";
import { Menu, Slider, Row, Pagination, Checkbox, Radio } from 'antd';
import {CloseOutlined, DownSquareOutlined} from "@ant-design/icons";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [price, setPrice]= useState([0,0]);
    const [categories, setCategories] = useState([]);
    const [subs, setSubs] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [subId, setSubId] = useState("");
    const [shippings, setShippings]  = useState(["Yes","No",]);
    const [colors, setColors]= useState([
        "Black","Red","Green","Silver","White","Blue","Yellow","Grey",
    ]);
    const [color, setColor] = useState("");
    const [shipping, setShipping] = useState("");
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
        getSubCategories().then((res) => setSubs(res.data));
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
        setCategoryIds([])
        setPrice(value);
        setSubId("");
        setShipping("");
        setColor("");
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
        setSubId("");
        setShipping("");
        setColor("");
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


      //load products based on subs
      const showSubs = () =>
        subs.map((c) => (
        <div key={c._id}
            onClick={() => handleSubs(c)}
            className="p-1 m-1 badge badge-secondary"
            style={{cursor:"pointer"}}
            >
            {c.name}
        </div>
        ));
    const handleSubs = (s) => {
        setSubId(s);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
          });
          setPrice([0, 0]);
          setCategoryIds([]);
          setShipping("");
          setColor("");
          fetchProducts({ sub: subId });
    }
    // filter by colors
    const showColors = () => colors.map((c) => (
        <Radio 
        value={c}
        name={c}
        checked={c===color}
        onChange = {handleColor}
        className="pb-2 pl-4 pr-4"
        >{c}</Radio>
    ))
    const handleColor = (e) =>{
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
          });
          setPrice([0, 0]);
          setSubId("");
          setCategoryIds([]);
          setColor(e.target.value);
          setShipping("");
          fetchProducts({color: e.target.value})

    }

    //filter by shippings
    const showShippings = () => shippings.map((c) => (
        <>
        <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShipping}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShipping}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
      </>
    ))
    const handleShipping = (e) =>{
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
          });
          setPrice([0, 0]);
          setSubId("");
          setColor("");
          setCategoryIds([]);
          setColor(e.target.value);
          fetchProducts({shipping: e.target.value})

    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 p-4">
                    <Menu defaultOpenKeys={["1", "2", "3", "4", "5"]} mode="inline">
                    <span className="h5">Filters</span>
                    {/* price*/}
                    <SubMenu key="1" title={<span className="h6"><DownSquareOutlined />PRICE</span>}>
                        <div>
                            <Slider className="ml-4 mr-4" tipFormatter={(v) => `Rs. ${v}`} range value={price} onChange={handleSlider} max="200000" />
                        </div>
                    </SubMenu>

                    {/* categories */}
                    <SubMenu key="2" title={<span className="h6"><DownSquareOutlined />CATEGORIES</span>}>
                        <div style={{ maringTop: "-10px" }}>{showCategories()}</div>
                    </SubMenu>

                    {/* sub categories */}
                    <SubMenu key="3" title={<span className="h6"><DownSquareOutlined />SUB CATEGORIES</span>}>
                        <div style={{ maringTop: "-10px" }}>{showSubs()}</div>
                    </SubMenu>

                    {/* color */}
                    <SubMenu key="4" title={<span className="h6"><DownSquareOutlined />COLOR</span>}>
                        <div style={{ maringTop: "-10px" }} className="pr-5">{showColors()}</div>
                    </SubMenu>

                    {/* shipping */}
                    <SubMenu key="5" title={<span className="h6"><DownSquareOutlined />SHIPPING</span>}>
                        <div style={{ maringTop: "-10px" }} className="pr-5">{showShippings()}</div>
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