import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { Input, Skeleton, Card, Select } from 'antd';
import {RightOutlined, LoadingOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {Button} from "antd";
import { createSubCategory, getSubCategories, removeSubCategory } from "../../../functions/subcategory";
import {getCategories, getCategoriesSub} from "../../../functions/category";

const { Meta } = Card;

const SubCategoryCreate = () => {
    const { Option } = Select;
    const [name, setName] = useState("");
    const [search, setSearch] = useState("");
    const [wait, setWait] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [category, setCategory] = useState("");
    const {user} = useSelector((state) => ({...state}));

    //list out categories and subcategories
    useEffect(() => {
        setLoading(true);
        loadCategories();
        loadSubCategories();
        setLoading(false);
    }, []);
    const loadCategories = () => {
        getCategories()
        .then(c => setCategories(c.data));
    }

    const loadSubCategories = () => {
        getSubCategories()
        .then(c => setSubCategories(c.data));
        setLoading(false);
    }

    //removecategory
    const handleRemove = async (slug) => {
        let answer = window.confirm("Are you sure want to delete this subcategory?");
        if(answer)
        {
            removeSubCategory(slug, user.token)
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
                loadSubCategories();
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
            toast.error('SubCategory name should be less than 20 characters', {
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
        if (typeof category === "undefined")
        {
            toast.error('Please select category.', {
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
        createSubCategory({name, parent:category}, user.token)
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
            loadSubCategories();
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


    //searchsubcategories
    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value.toLowerCase());
    }

    const searched = (search) => (c) => c.name.toLowerCase().includes(search);

    //select-category-option
    const onSelectCategory = (value) => {
        setCategory(value);
    }
    //search category wise sub
    const onSearchCategory = (value) => {
        setLoading(true);
        setSubCategories([]);
        getCategoriesSub(value)
        .then(c => setSubCategories(c.data));
        setLoading(false);
    }
    const clearOptionCreate = () =>{
        setCategory("0");
    }

    //subcategory form
    const subcategoryForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col">
                <Select
                    allowClear={clearOptionCreate}
                    showSearch
                    style={{ width: "50%" }}
                    placeholder="Select the category"
                    optionFilterProp="children"
                    size = "large"
                    className="mt-3 mb-3"
                    onChange={onSelectCategory}
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {categories.length>0 && categories.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>

                </div>
                <div className="col">
                    <Input className="mt-3 mb-3" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Enter the subcategory name" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"50%"}}/>
                </div>
            </div>
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
                Create the SubCategory</Button>
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
    //searchform
    const searchCategory = () =>(
        <>
            <div className="row">
                <div className="col">
                <Select
                    showSearch
                    style={{ width: "50%" }}
                    placeholder="Search by category"
                    optionFilterProp="children"
                    size = "large"
                    className="mt-3 mb-3"
                    onChange={onSearchCategory}
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {categories.length>0 && categories.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>

                </div>
                <div className="col">
                    <Input className="mt-3 mb-3" autoFocus value={search} onChange={handleSearchChange} placeholder="Search by subcategory name" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"50%"}}/>
                </div>
            </div>
            <br />
            </>
    )

    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Create Sub Category</h1>
                {subcategoryForm()}
                <br/>
                {searchCategory()}
                </div>
                <div className="container">
                    <div className="row">
                    {subcategories.filter(searched(search)).map((c) => (
                        <div key={c._id} className="ml-5 mb-2"> 
                        {console.log()}
                        <Card
                            style={{ width: 300, marginTop: 16 }}
                            actions={[
                            <Link to={`/admin/subcategory/${c.slug}`}><EditOutlined key="edit" /></Link>,
                            <DeleteOutlined key="delete" onClick={() => handleRemove(c.slug)} />,
                            ]}
                        >
                        <Skeleton style={{ width: 300, marginTop: 16 }} loading={loading} active>
                        <Meta
                            title={c.name}
                            description={categories.find(({ _id }) => _id === c.parent).name}
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
export default SubCategoryCreate;

