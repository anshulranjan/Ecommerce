import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { Input, Skeleton, Card, DatePicker, Space } from 'antd';
import {RightOutlined, LoadingOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {Button} from "antd";
import { createCoupon, getCoupons, removeCoupon } from "../../../functions/coupon";
import moment from 'moment';

const { Meta } = Card;

const CouponCreate = () => {
    const [name, setName] = useState("");
    const [discount, setDiscount] = useState("")
    const [expiry, setExpiry] = useState("")
    const [search, setSearch] = useState("");
    const [wait, setWait] = useState(false);
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState([]);
    const {user} = useSelector((state) => ({...state}));

    //list out coupons
    useEffect(() => {
        loadCoupons();
    }, []);
    const loadCoupons = () => {
        getCoupons()
        .then(c => setCoupons(c.data));
        setLoading(false);
    }

    //removeCoupons
    const handleRemove = async (couponId) => {
        let answer = window.confirm("Are you sure want to delete this coupon?");
        if(answer)
        {
            removeCoupon(couponId, user.token)
            .then(res => {
                toast.error(`"${res.data.name}" deleted successfully`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                setLoading(true);
                loadCoupons();
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

    //create coupon
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if (name.length<6 || name.length>=13)
        {
            toast.error('Coupon Name should be between 6 and 12 characters', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        let isnum = /^\d+$/.test(discount);
        if(discount.length == 0)
        {
            toast.error('Discount amount should not be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;

        }
        if(!isnum)
        {
            toast.error('Discount must be integer value', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if(expiry.length==0)
        {
            toast.error('Expiry Date is required', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        setWait(true);
        createCoupon({name, discount, expiry}, user.token)
        .then(res => {
            setWait(false);
            setName("");
            setExpiry("");
            setDiscount("")
            toast.success(`"${res.data.name}" created successfully`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            setLoading(true);
            loadCoupons();
        })
        .catch(err => {
            setWait(false);
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


    //search coupons
    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value.toLowerCase());
    }
    const searched = (search) => (c) => c.name.toLowerCase().includes(search);
    
    //handle date change
    const onChangeDate = (date, dateString) => {
        setExpiry(date)
    }

    //coupon form
    const couponForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <Input className="mt-3 mb-3" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Enter the coupon name" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"50%"}}/>
            <br />
            <Input type="number" className="mt-3 mb-3" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Enter the Discount Amount" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"50%"}}/>
            <br />
            <Space direction="vertical" style={{width:"100%"}}>
                <DatePicker className="mt-3 mb-3" value={expiry} onChange={onChangeDate} placeholder="Choose expiry date" style={{width:"50%"}}/>
            </Space>
            <br />
            {!wait && (
                <Button 
                    onClick={handleSubmit}
                    type="primary"
                    shape="round"
                    className = "mt-3"
                    block
                    icon = {<RightOutlined />}
                    size="large"
                    disabled = {name.length < 6 || discount.length==0 }
                    style={{width:"50%"}}
                >
                Create Coupon</Button>
            )}
            {wait && (
                <Button 
                type="light"
                shape="round"
                className = "mt-3"
                block
                icon = {<LoadingOutlined />}
                size="large"
                style={{width:"50%"}}
            >
            Please Wait...</Button>
            )}
        </form>
        </>
    )
    const searchCoupon = () =>(
        <>
            <Input className="mt-3 mb-3" autoFocus value={search} onChange={handleSearchChange} placeholder="Search coupons" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"25%"}}/>
        </>
    )
    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Create Coupon</h1>
                {couponForm()}
                <br/>
                </div>
                <div className="container">
                    <div className="row ml-5">
                        {searchCoupon()}
                    </div>
                    <div className="row">
                    {coupons.filter(searched(search)).map((c) => (
                        <div key={c._id} className="ml-5 mb-2"> 
                        <Card
                            style={{ width: 300, marginTop: 16 }}
                            actions={[
                            <DeleteOutlined key="delete" onClick={() => handleRemove(c._id)} />,
                            ]}
                        >
                        <Skeleton style={{ width: 300, marginTop: 16 }} loading={loading} active>
                        <Meta
                            title={c.name}
                        />
                        <br />
                        <p>Discount : {c.discount}</p>
                        <p>Expiring On : {c.expiry.slice(0,10)}</p>
                        </Skeleton>
                        </Card>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            </div>
    )

}
export default CouponCreate;

