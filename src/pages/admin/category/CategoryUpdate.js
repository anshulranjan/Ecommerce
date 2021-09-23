import React, {useState, useEffect} from "react";
import CategoryCreate from "./CategoryCreate";
import AdminNav from "../../../components/nav/AdminNav";
import { getCategory, updateCategory } from "../../../functions/category";
import {Button, Input} from "antd";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import {RightOutlined, LoadingOutlined, BackwardOutlined} from '@ant-design/icons';

const CategoryUpdate = ({history, match}) =>
{
    const [name, setName] = useState("");
    const [wait, setWait] = useState(true);
    const {user} = useSelector((state) => ({...state}));

    //list out single category
    useEffect(() => {
        loadCategory();
    }, []);
    const loadCategory = () => {
        getCategory(match.params.slug)
        .then(c => setName(c.data.name));
        setWait(false)
    }

    //updatethevalue
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if (name.length<3 || name.length>=20)
        {
            toast.error('Category name should be less than 20 characters', {
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
        updateCategory(match.params.slug, {name}, user.token)
        .then(res => {
            setWait(false);
            setName("");
            toast.success(`"${res.data.name}" updated successfully`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            history.push("/admin/category")
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


    const categoryUpdate = () => (
        <>
        <form onSubmit={handleSubmit}>
            <Input className="mt-3 mb-3" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Enter the category name" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"50%"}}/>
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
                    disabled = {name.length < 3 }
                    style={{width:"50%"}}
                >
                Update the Category</Button>
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
            <br/>
        </form>
        </>

    )
    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Update Category</h1>
                {categoryUpdate()}
                </div>
            </div>
            </div>
    )
}
export default CategoryUpdate;