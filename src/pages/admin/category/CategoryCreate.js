import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { Input, Skeleton, Card } from 'antd';
import {RightOutlined, LoadingOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {Button} from "antd";
import { createCategory, getCategories, removeCategory } from "../../../functions/category";

const { Meta } = Card;

const CategoryCreate = () => {
    const [name, setName] = useState("");
    const [wait, setWait] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const {user} = useSelector((state) => ({...state}));

    //list out categories
    useEffect(() => {
        loadCategories();
    }, []);
    const loadCategories = () => {
        getCategories()
        .then(c => setCategories(c.data));
        setLoading(false);
    }

    //removecategory
    const handleRemove = async (slug) => {
        let answer = window.confirm("Are you sure want to delete this category?");
        if(answer)
        {
            removeCategory(slug, user.token)
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
                loadCategories();

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

    //create categories
    const handleSubmit = async(e) =>{
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
        createCategory({name}, user.token)
        .then(res => {
            setWait(false);
            setName("");
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
            loadCategories();
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
    const categoryForm = () => (
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
                Create the Category</Button>
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
    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Create Category</h1>
                {categoryForm()}
                < hr />
                </div>
                <div className="container">
                    <div className="row">
                    {categories.map((c) => (
                        <div key={c._id} className="ml-5"> 
                        <Card
                            style={{ width: 300, marginTop: 16 }}
                            actions={[
                            <Link to={`/admin/category/${c.slug}`}><EditOutlined key="edit" /></Link>,
                            <DeleteOutlined key="delete" onClick={() => handleRemove(c.slug)} />,
                            ]}
                        >
                        <Skeleton style={{ width: 300, marginTop: 16 }} loading={loading} active>
                        <Meta
                            title={c.name}
                        />
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
export default CategoryCreate;

