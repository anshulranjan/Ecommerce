import React, {useState, useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { Input, Form, Select, Upload, Avatar, Badge } from 'antd';
import {RightOutlined, LoadingOutlined, BranchesOutlined} from '@ant-design/icons';
import {Button} from "antd";
import {getCategories, getCategoriesSub } from "../../../functions/category";
import { getProduct, updateProduct } from "../../../functions/product";
import ImgCrop from 'antd-img-crop';
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { getSubBrand } from "../../../functions/subcategory";

const initState = {
    
    categories:[],
    colors:["Black","Red","Green","Silver","White","Blue","Yellow","Black","Grey"],
};
const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
};

const ProductUpdate = ({match, history}) => {
    const [values, setValues] = useState(initState);
    const {categories, colors} = values;
    const [wait, setWait] = useState(false);
    const { TextArea } = Input;
    const { Option } = Select;
    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [description, setDes] = useState("");
    const [price, setPrice] = useState("");
    const [delivery, setDelivery] = useState("");
    const [discount, setDiscount] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSub] = useState("");
    const [quantity, setQuantity] = useState("");
    const [color, setColor] = useState("");
    const [brand, setBrand] = useState("");
    const [gender, setGender] = useState("");
    const [shipping, setShipping] = useState("");
    const [subsOptions, setSubOptions] = useState([]);
    const [brandsOptions, setBrandOptions] = useState([]);
    const {user} = useSelector((state) => ({...state}));
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    let allUploadedFiles = images;

    //load all categories
    useEffect(() => {
        loadProduct();
        loadCategories();
    }, []);
    const loadProduct = () =>{
        getProduct(match.params.slug)
        .then(p => {
            console.log(p.data)
            setImages(p.data.images);
            setTitle(p.data.title);
            setDes(p.data.description);
            setPrice(p.data.price);
            setDelivery(p.data.delivery);
            setDiscount(p.data.discount);
            setCategory(p.data.category._id);
            setSub(p.data.subcategory._id);
            setQuantity(p.data.quantity);
            setColor(p.data.color);
            setBrand(p.data.brand._id);
            setGender(p.data.gender);
            setShipping(p.data.shipping);
            loadSubCategory(p.data.category._id);
            getSubBrand(p.data.subcategory._id)
            .then(res => {
                setBrandOptions(res.data)
            })
            
            setLoading(false);
        })
    }
    const loadCategories = () => {
        getCategories()
        .then(c => setValues({ ...values, categories: c.data }));
    }
    const loadSubCategory = (value) =>{
        getCategoriesSub(value)
            .then(res =>{
                console.log(res.data);
                setSubOptions(res.data);
            })
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
       updateProduct(match.params.slug, {images,title, delivery, discount, description, price, quantity, category, subcategory, color, gender, brand, shipping}, user.token)
        .then(res => {
            toast.success(`"${res.data.title}" updated successfully`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            history.push("/admin/products")
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
                    allUploadedFiles.push(res.data);
                    setImages(allUploadedFiles);
                    setUploading(false);
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
            let filteredimage = images.filter((item) => {
                return item.public_id !== public_id
            });
            setImages(filteredimage);
        })
        .catch(err => {
            console.log(err)
        })
    }
    

   //handle methods from form
    const handleChangeName = (e) => {
        setTitle(e.target.value);
    };
    const handleChangeDes = (e) => {
        setDes(e.target.value);
    };
    const handleChangePrice = (e) => {
        setPrice(e.target.value);
    };
    const handleChangeDelivery = (e) => {
        setDelivery(e.target.value);
    };
    const handleChangeDiscount = (e) => {
        setDiscount(e.target.value);
    };
    const handleChangeQuantity = (e) => {
        setQuantity(e.target.value);
    };

    const onSelectColor = (value) => {
        setColor(value);
    }
    const onSelectShipping = (value) => {
        setShipping(value);
    }
    const onSelectCategory = (value) => {
        setCategory(value);
        setSub("");
        setBrand("");
        getCategoriesSub(value)
        .then(res =>{
            setSubOptions(res.data);
        })
    }
    const onSelectSubCategory = (value) => {
        setSub(value);
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
            {images && images.map((image) => (
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
                value={title}
                label="Product Name"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
            >
            <Input name="title" placeholder="Enter the Product Name"  value={title}
                onChange = {handleChangeName}
                />
            </Form.Item>
           


            <Form.Item
                label="Description"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
                
            >
            <TextArea name="description" rows={6} placeholder="Enter the Product description" value={description}
                onChange = {handleChangeDes} style={{whiteSpace: "pre-wrap"}} />
            </Form.Item>



            <Form.Item
                label="Price"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
            >
            <Input name="price" placeholder="Enter the Product Price" value={price}
                onChange = {handleChangePrice}/>
            </Form.Item>

            <Form.Item
                label="Discount"
                rules={[{ whitespace: true }]}
                className="ml-5"
            >
            <Input name="discount" placeholder="Enter the Product Discount Value" value={discount}
                onChange = {handleChangeDiscount}/>
            </Form.Item>

            <Form.Item
                label="Delivery Cost"
                rules={[{  whitespace: true }]}
                className="ml-5"
            >
            <Input name="delivery" placeholder="Enter Delivery Charges" value={delivery}
                onChange = {handleChangeDelivery}/>
            </Form.Item>

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
                    onChange = {onSelectSubCategory}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                >
                {subsOptions && subsOptions.length>0 && subsOptions.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>
            </Form.Item>
        
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
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                >
                {brandsOptions && brandsOptions.length>0 && brandsOptions.map((c) => (
                        <Option key={c._id} value={c._id} style={{backgroundColor:"white"}}>{c.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
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
                label="Quantity"
                rules={[{ required: true,  whitespace: true }]}
                className="ml-5"
            >
            <Input name="quantity" placeholder="Mention the Quantity" value={quantity}
                onChange = {handleChangeQuantity}/>
            </Form.Item>

            <Form.Item
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
                label="Suitable For"
                className="ml-5"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <Select 
                    placeholder="Please select"
                    value={gender}
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
                    //disabled = {title.length < 3 }
                    style={{width:"50%"}}
                >
                Update the Product</Button>
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
                <h1 className="p-3" style={{fontFamily:"Metropolis"}}>Update Product</h1>
                {!loading && productForm()}
                <br/>
                </div>
                
            </div>
            </div>
    )

}
export default ProductUpdate;

