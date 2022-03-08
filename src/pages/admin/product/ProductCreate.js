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
import { getSubBrand } from "../../../functions/subcategory";

const initState = {
    title:'',
    description:'',
    price:'',
    images:[],
    categories:[],
    subcategory:[],
    quantity:'',
    delivery:'',
    discount:'',
    colors:["Black","Red","Green","Silver","White","Blue","Yellow","Grey"],
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
    const {title, images, description, price, delivery, discount, categories, subcategory, quantity, colors} = values;
    const [wait, setWait] = useState(false);
    const { TextArea } = Input;
    const { Option } = Select;
    const [color, setColor] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [gender, setGender] = useState("");
    const [shipping, setShipping] = useState("");
    const [subsOptions, setSubOptions] = useState([]);
    const [brandsOptions, setBrandOptions] = useState([]);
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
       if(images.length==0 || title.length==0 || description.length==0 || price.length==0 || category.length==0 || subcategory.length==0 || quantity.length==0 || color.length==0 || brand.length==0 || gender.length==0 || shipping.length==0)
       {
            toast.error('All fields are required', {
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
       let isnum = /^\d+$/.test(price);
       let isnum1 = /^\d+$/.test(quantity);
       if(!isnum)
       {
            toast.error('The price must be only integer value', {
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
       if(!isnum1)
       {
            toast.error('The quantity must be integer value', {
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
       createProduct({values, color, shipping, delivery, discount, category, gender, brand},user.token)
       .then(res=>{
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
            Resizer.imageFileResizer(file,1080,1080,"JPEG",100,0,(uri) => {
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
        setCategory(value);
        setValues({ ...values, subcategory: [] });
        setBrand("");
        getCategoriesSub(value)
        .then(res =>{
            setSubOptions(res.data);
        })
    }
    const onSelectSubCategory = (value) => {
        setValues({ ...values, subcategory: value });
        setBrand("");
        getSubBrand(value)
        .then(res => {
            setBrandOptions(res.data)
        })
    }
    const onSelectGender = (value) => {
        setGender(value);
    }
    const onSelectBrand = (value) => {
        setBrand(value);
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
                onChange = {handleChange} style={{whiteSpace: "pre-wrap"}}/>
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
                name="discount"
                label="Discount"
                rules={[{ whitespace: true }]}
                className="ml-5"
            >
            <Input name="discount" placeholder="Enter the Product Discount Value" value={discount}
                onChange = {handleChange}/>
            </Form.Item>

            <Form.Item
                name="delivery"
                label="Delivery Cost"
                rules={[{  whitespace: true }]}
                className="ml-5"
            >
            <Input name="delivery" placeholder="Enter Delivery Charges" value={delivery}
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
                    showSearch
                    placeholder="Please select the category"
                    value={category}
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
                    value={subcategory}
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
            {brandsOptions && brandsOptions.length>0 && (
            <Form.Item
                label="Brand"
                className="ml-5"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <Select 
                    showSearch
                    placeholder="Please select the brand"
                    value={brand}
                    name="brand"
                    onChange = {onSelectBrand}
                    
                >
                {brandsOptions.length>0 && brandsOptions.map((c) => (
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

