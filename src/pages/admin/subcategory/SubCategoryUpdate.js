import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { Input, Select } from 'antd';
import {RightOutlined, LoadingOutlined} from '@ant-design/icons';
import {Button} from "antd";
import { getSubCategory, updateSubCategory } from "../../../functions/subcategory";
import {getCategories} from "../../../functions/category";


const SubCategoryUpdate = ({history, match}) => {
    const { Option } = Select;
    const [name, setName] = useState("");
    const [wait, setWait] = useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState("");
    const {user} = useSelector((state) => ({...state}));

    //list out categories and subcategories
    useEffect(() => {
        loadCategories();
        loadSub();
    }, []);
    const loadCategories = () => {
        getCategories()
        .then(c => setCategories(c.data));
    }
    const loadSub = () => {
        getSubCategory(match.params.slug)
        .then(c => {
            setName(c.data.name);
            setParent(c.data.parent);
        });
    }
    //update subcategories
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
        if (parent=="")
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
        updateSubCategory(match.params.slug, {name, parent:parent}, user.token)
        .then(res => {
            toast.success(`"${res.data.name}" updated successfully`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            history.push("/admin/sub")
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



    //select-category-option
    const onSelectCategory = (value) => {
        setParent(value);
    }

    //subcategory form
    const subcategoryForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col">
                <Select
                    showSearch
                    style={{ width: "50%" }}
                    placeholder="Select the category"
                    optionFilterProp="children"
                    size = "large"
                    className="mt-3 mb-3"
                    onChange={onSelectCategory}
                    value={parent}
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
                Update the SubCategory</Button>
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
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Update Sub Category</h1>
                {subcategoryForm()}
                <br/>
                </div>
            </div>
            </div>
    )

}
export default SubCategoryUpdate;

