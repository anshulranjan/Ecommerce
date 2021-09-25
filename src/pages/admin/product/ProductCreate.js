import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Input, Form, Select, Upload, Avatar, Badge } from 'antd';
import {RightOutlined, LoadingOutlined} from '@ant-design/icons';
import {Button} from "antd";
import {getCategories, getCategoriesSub } from "../../../functions/category";
import { createProduct } from "../../../functions/product";
import ImgCrop from 'antd-img-crop';
import axios from "axios";
import Resizer from "react-image-file-resizer";

const initState = {
    title:'',
    description:'',
    price:'',
    category:'',
    images:[],
    categories:[],
    subcategory:[],
    quantity:'',
    colors:["Black","Red","Green","Silver","White","Blue"],
};
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
};

const ProductCreate = () => {
    const [values, setValues] = useState(initState);
    const {title, description, price, category, categories, subcategory, quantity, colors} = values;
    const [wait, setWait] = useState(false);
    const { TextArea } = Input;
    const { Option } = Select;
    const [color, setColor] = useState("");
    const [gender, setGender] = useState("");
    const [shipping, setShipping] = useState("");
    const [subsOptions, setSubOptions] = useState([]);
    const {user} = useSelector((state) => ({...state}));
    const [uploading, setUploading] = useState(false);
    let allUploadedFiles = values.images;

    //load all categories
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories()
        .then(c => setValues({ ...values, categories: c.data }));
    }
    
   const handleSubmit = (e) => {
       e.preventDefault();
       setWait(true);

       createProduct({values, color, shipping, gender},user.token)
       .then(res=>{
           console.log(res)
           setWait(false);
           window.alert(`${res.data.title} is created`);
           window.location.reload();
           
       })
       .catch(err => {
        setWait(false);
            toast.error(err.response.data.err, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

    })
   }

   //file upload functions
   
    const uploadImage = ({ file, onSuccess, data}) =>{
            setUploading(true);
            Resizer.imageFileResizer(file,720,720,"JPEG",100,0,(uri) => {
                axios.post(`${process.env.REACT_APP_API}/uploadimages`,{image:uri},{
                    headers:{
                        authtoken: user.token
                    }
                })
                .then(res=> {
                    data = res.data;
                    setUploading(false);
                    allUploadedFiles.push(res.data);
                    setValues({ ...values, images: allUploadedFiles });
                    setTimeout(() => {
                        onSuccess("ok");
                    }, 0);
                })
                .catch(err => {
                    console.log(err)
                })
              },"base64");
    };
    const handleImageRemove = (public_id) => {
        axios.post(`${process.env.REACT_APP_API}/removeimage`,{public_id},{
            headers:{
                authtoken: user.token
            },
        })
        .then((res) =>{
            const {images} = values;
            let filteredimage = images.filter((item) => {
                return item.public_id !== public_id
            });
            setValues({ ...values, images: filteredimage });
        })
        .catch(err => {
            console.log(err)
        })
    }
    

   //handle methods from form
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const onSelectColor = (value) => {
        setColor(value);
    }
    const onSelectShipping = (value) => {
        setShipping(value);
    }
    const onSelectCategory = (value) => {
        setValues({ ...values, category: value });
        getCategoriesSub(value)
        .then(res =>{
            setSubOptions(res.data);
        })
    }
    const onSelectSubCategory = (value) => {
        setValues({ ...values, subcategory: value });
    }
    const onSelectGender = (value) => {
        setGender(value);
    }

    //product form
    const productForm = () => (
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
                label="Upload the Images"
                rules={[{ required: true,}]}
                className="ml-5"
            >
            {values.images && values.images.map((image) => (
                    <Badge count="X" key = {image.public_id} onClick ={() =>handleImageRemove(image.public_id)} style={{cursor:"pointer"}}>
                    <Avatar src = {image.url} size={105} shape="square" className="ml-4 border mb-2"/>
                    </Badge>
            ))}
            {uploading &&  (
                    <Avatar size={105} shape="square" className="ml-4 border mb-2" icon={<LoadingOutlined/> } />
            )}
            <ImgCrop rotate>
            <Upload
                customRequest = {uploadImage}
                listType="picture-card"
                showUploadList={false}
            >
            {allUploadedFiles.length < 4 && '+ Upload'}
            </Upload>
            </ImgCrop>
            </Form.Item>

            <Form.Item
                name="title"
                label="Product Name"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
            >
            <Input name="title" placeholder="Enter the Product Name"  value={title}
                onChange = {handleChange}
                />
            </Form.Item>
           


            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
                
            >
            <TextArea name="description" rows={6} placeholder="Enter the Product description" value={description}
                onChange = {handleChange}/>
            </Form.Item>



            <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
            >
            <Input name="price" placeholder="Enter the Product Price" value={price}
                onChange = {handleChange}/>
            </Form.Item>

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
                    placeholder="Please select the category"
                    value={category}
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
                    mode="multiple"
                    placeholder="Please select the sub category"
                    value={subcategory}
                    name="subcategory"
                    onChange = {onSelectSubCategory}
                >
                {subsOptions.length>0 && subsOptions.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            )}
            <Form.Item
                name="shipping"
                label="Shipping"
                className="ml-5"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <Select 
                    placeholder="Please select the shipping"
                    value={shipping}
                    name="shipping"
                    onChange = {onSelectShipping}
                >
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
            >
            <Input name="quantity" placeholder="Mention the Quantity" value={quantity}
                onChange = {handleChange}/>
            </Form.Item>

            <Form.Item
                name="color"
                label="Color"
                className="ml-5"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <Select 
                    name="color"
                    placeholder="Please select the color"
                    value={color}
                    onChange = {onSelectColor}
                >
                    {colors.map((c) => (
                        <Option key={c} value={c} style={{backgroundColor:"white"}}>{c}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="gender"
                label="Suitable For"
                className="ml-5"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <Select 
                    name="color"
                    placeholder="Please select the category"
                    value={color}
                    onChange = {onSelectGender}
                >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="both">Both</Option>
                </Select>
                </Form.Item>


            <br />
            {!wait && (
                <Button 
                    onClick={handleSubmit}
                    type="primary"
                    shape="round"
                    className = "mt-3 ml-5"
                    block
                    icon = {<RightOutlined />}
                    size="large"
                    disabled = {title.length < 3 }
                    style={{width:"50%"}}
                >
                Add the Product</Button>
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
        </Form>
        </>
    )
    
    return(
        <div id="viewport">
            <AdminNav />
            <div id="content">
                <div className="container-fluid text-center">
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Create Product</h1>
                {productForm()}
                <br/>
                </div>
                
            </div>
            </div>
    )

}
export default ProductCreate;

