import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../functions/product";
import { Input, Card, Skeleton, Image } from 'antd';
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

const { Meta } = Card;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const arr = new Array(21);
    const {user} = useSelector((state) => ({...state}));
    var elements=[];
    useEffect(() => {
        loadAllProducts();
    }, []);
    const loadAllProducts = () => {
        getProductsByCount(100)
        .then(res => {
            setProducts(res.data);
            setLoading(false);
        })
        .catch(err =>{
                if(err.response.status === 400){
                    toast.error(err.response.data, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
        })
    }
    //search products
    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value.toLowerCase());
    }
    const searched = (search) => (c) => c.name.toLowerCase().includes(search);

    //remove product
    const handleRemove = async (slug) => {
        let answer = window.confirm("Are you sure want to delete this product?");
        if(answer)
        {
            removeProduct(slug, user.token)
            .then(res => {
                toast.error(`"${res.data.title}" deleted successfully`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                setLoading(true);
                loadAllProducts();
            })
            .catch(err =>{
                if(err.response.status === 400){
                    toast.error(err.response.data, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
        }
    }

    const defaultImage = () => (
        <Image />
    )
    for(var i=0;i<arr.length;i++){
        elements.push(
            <div className="col-md-4 mb-2" key={i}> 
            <Card
                        style={{ width: 300, marginTop: 16 }}
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                        ]}
            >
            <Skeleton active/>
            </Card>
            </div>
            );
    }
    const searchProduct = () =>(
        <>
            <Input className="mt-3 mb-3" autoFocus value={search} onChange={handleSearchChange} placeholder="Search Products" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"25%"}}/>
        </>
    )
    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>All Products</h1>
                </div>
                <div className="container">
                    <div className="row ml-5">
                        {searchProduct()}
                    </div>
                    <div className="row mt-4">
                        {loading && elements}
                        {!loading && products.map((p) => (
                            <div className="col-md-4 mb-2" key={p._id}> 
                            <Card
                            style={{ width: 300 }}
                            cover={
                              <img
                                src={p.images && p.images.length ? p.images[0].url : defaultImage() }
                                style={{height:"150px", objectFit:'cover'}}
                                className="p-1"
                              />
                            }
                            actions={[
                                <Link to={`/admin/product/${p.slug}`}><EditOutlined key="edit" /></Link>,
                                <DeleteOutlined key="delete" onClick={() => handleRemove(p.slug)} />,
                              
                            ]}
                          >
                            <Meta
                            />
                            <h6>{p.title}</h6>
                            <p>Rs {p.price}</p>
                          </Card>
                          </div>
                        )

                        )}
                    </div>
                </div>
            </div>
            </div>
    )

}
export default ProductList;

