import React, {useEffect, useState} from "react";
import { getProduct } from "../functions/product";
import { Row, Col } from 'antd';
import { SingleProduct } from "../components/singleproduct/SingleProduct";
const Product = ({match}) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const {slug} = match.params;
    useEffect(() => {
        loadProduct();
    },[slug]);
    const loadProduct = () =>{
        getProduct(slug)
        .then((res) => {
            setProduct(res.data);
            setLoading(false);
        });
    };
    return(
        <div className="p-2">
        <Row>
            {!loading && <SingleProduct product = {product} />}
        </Row>
        </div>
    )


}

export default Product;