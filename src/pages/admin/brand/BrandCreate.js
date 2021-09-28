import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Input, Form, Select } from 'antd';
import {RightOutlined, LoadingOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {Button} from "antd";
import { Skeleton, Card } from 'antd';
import { Link } from "react-router-dom";
import {getCategories, getCategoriesSub } from "../../../functions/category";
import { createBrand, getBrands,removeBrand } from "../../../functions/brand";
import { getSubCategories } from "../../../functions/subcategory";

const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
};
const { Meta } = Card;


const BrandCreaate = () => {
    const [name, setName] = useState("");
    const [parentCat, setparentCat] = useState("")
    const [parentSub, setparentSub] = useState("")
    const [wait, setWait] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subsOptions, setSubOptions] = useState([]);
    const [keyword, setKeyWord] = useState("");
    const [brands, setBrands] = useState([]);
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allSubs, setAllSubs] = useState([]);
    const {Option } = Select;
    const {user} = useSelector((state) => ({...state}));

    //load all categories and sub categories
    useEffect(() => {
        loadCategories();
    }, []);
    const loadCategories = () => {
        getCategories()
        .then(c => {
            setCategories(c.data);
            loadSubCategories();
        })
    }
    const loadSubCategories = () => {
        getSubCategories()
        .then(c => {
            setAllSubs(c.data);
            loadBrands();
        });
    }
    const loadBrands = () => {
        getBrands()
        .then(c => {
            setBrands(c.data);
            setCheck(true);
        })
        setLoading(false);
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
            loadSubCategories();
            setLoading(true)
            loadBrands();
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
        setparentSub("");
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
    

    //brand

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
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                >
                {categories.length>0 && categories.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            {subsOptions && subsOptions.length>0 && (
                <Form.Item
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
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                >
                {subsOptions.length>0 && subsOptions.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                    </Select>
                </Form.Item>
            )}
            {parentSub && parentSub!== "" && (
                <Form.Item
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


    //searchfunction
    
    const handleSearchChange = (e) => {
        e.preventDefault();
        setKeyWord(e.target.value.toLowerCase());
    }
    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
    //searchbrand
    const searchBrand = () =>(
        <>
            <Input className="mt-3 mb-3" autoFocus value={keyword} onChange={handleSearchChange} placeholder="Search brands" style={{borderLeft:"0", borderRight:"0", borderTop:"0", borderWidth:"3px", width:"25%"}}/>
        </>
    )

    //remove functions
    const handleRemove = async (id) => {
        let answer = window.confirm("Are you sure want to delete this brand? All the associated products will be deleted.");
        if(answer)
        {
            removeBrand(id, user.token)
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
                loadSubCategories();
                setLoading(true);
                loadBrands();

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
                <div className="container">
                    <div className="row ml-5">
                        {searchBrand()}
                    </div>
                    <div className="row">
                    {check ? brands.filter(searched(keyword)).map((c) => (
                        <div key={c._id} className="ml-5 mb-2"> 
                        <Card
                            style={{ width: 300, marginTop: 16 }}
                            actions={[
                            <Link to={`/admin/brand/${c._id}`}><EditOutlined key="edit" /></Link>,
                            <DeleteOutlined key="delete" onClick={() => handleRemove(c._id)} />,
                            ]}
                        >
                        <Skeleton style={{ width: 300, marginTop: 16 }} loading={loading} active>
                        <Meta
                            title={c.name}
                        />
                        <br />
                        {categories.find(({ _id }) => _id === c.parentCat).name ? (
                            <p>Category: {categories.find(({ _id }) => _id === c.parentCat).name}</p>) : "Loading Failed. Try Again"
                        }
                        <br />
                        {allSubs.find(({ _id }) => _id === c.parentSub).name ? (
                            <p>Sub Category: {allSubs.find(({ _id }) => _id === c.parentSub).name}</p>) : "Loading Failed. Try Again"
                        }
                        </Skeleton>
                        </Card>
                        </div>
                    )) : (
                        <div className="ml-5 mb-2">
                        <Card style={{ width: 300, marginTop: 16 }}><Skeleton style={{ width: 300, marginTop: 16 }}/></Card>                      
                          </div>
                        )}
                    </div>
                </div>
                
            </div>
    )

}

export default BrandCreaate;