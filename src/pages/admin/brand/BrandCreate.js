import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Input, Form, Select } from 'antd';
import {RightOutlined, LoadingOutlined} from '@ant-design/icons';
import {Button} from "antd";
import {getCategories, getCategoriesSub } from "../../../functions/category";
import { createBrand } from "../../../functions/brand";

const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
};


const BrandCreaate = () => {
    const [name, setName] = useState("");
    const [parentCat, setparentCat] = useState("")
    const [parentSub, setparentSub] = useState("")
    const [wait, setWait] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subsOptions, setSubOptions] = useState([]);
    const {Option } = Select;
    const {user} = useSelector((state) => ({...state}));

    //load all categories and sub categories
    useEffect(() => {
        loadCategories();
    }, []);
    const loadCategories = () => {
        getCategories()
        .then(c => setCategories(c.data));
    }
    //create brand
    const handleSubmit = async(e) => {
        e.preventDefault();
        setWait(true);
        createBrand({name, parentCat:parentCat, parentSub:parentSub}, user.token)
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

    //handle methods from form
    const onSelectCategory = (value) => {
        setparentCat(value);
        getCategoriesSub(value)
        .then(res =>{
            setSubOptions(res.data);
        })
    }
    const onSelectSubCategory = (value) => {
        setparentSub(value);
    }
    const handleChange = (e) => {
        setName(e.target.value)
    };
    

    const brandForm = () => (
        <>
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={handleSubmit}
            initialValues={{
                'input-number': 3,
                'checkbox-group': ['A', 'B'],
                rate: 3.5,
            }}
         >
            <Form.Item
                name="category"
                label="Category"
                className="ml-5"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <Select 
                    showSearch
                    placeholder="Please select the category"
                    value={parentCat}
                    name="category"
                    onChange = {onSelectCategory}
                >
                {categories.length>0 && categories.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            {subsOptions && subsOptions.length>0 && (
                <Form.Item
                    name="subcategory"
                    label="Sub Category"
                    className="ml-5"
                    rules={[
                    {
                        required: true,
                    },
                    ]}
                >
                <Select 
                    showSearch
                    placeholder="Please select the sub category"
                    value={parentSub}
                    name="subcategory"
                    onChange = {onSelectSubCategory}
                >
                {subsOptions.length>0 && subsOptions.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                    </Select>
                </Form.Item>
            )}
            {parentSub && parentSub!== "" && (
                <Form.Item
                    name="name"
                    label="Brand Name"
                    rules={[{ required: true,  whitespace: true }]}
                    className="ml-5"
                >
                <Input name="name" placeholder="Enter the Brand Name"  value={name}
                    onChange = {handleChange}
                    />
                </Form.Item>
            )}
            {!wait && name!== "" && (
                    <Button 
                        onClick={handleSubmit}
                        type="primary"
                        shape="round"
                        className = "mt-3 ml-5"
                        block
                        icon = {<RightOutlined />}
                        size="large"
                        style={{width:"50%"}}
                    >
                    Add the Brand</Button>
                )
            }
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
        </Form>
        </>

    )

    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Create Brand</h1>
                {brandForm()}
                <br/>
                </div>
                
                
            </div>
            </div>
    )

}

export default BrandCreaate;