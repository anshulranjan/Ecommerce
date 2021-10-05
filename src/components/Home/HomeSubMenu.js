import React, {useState, useEffect} from "react";
import { Row, Col, Menu, Avatar, Skeleton } from 'antd';
import electronics from "./Electronics.png";
import footwear from "./Footwear.png";
import clothes from "./Clothes.png";
import appliances from "./Appliance.png";
import interiors from "./Interiors.png";
import toys from "./Toys.png";
import { Link } from "react-router-dom";
import {getCategoriesSub} from "../../functions/category";
const { SubMenu } = Menu;

const style = { padding: '8px 0' };
export const HomeSubMenu = () =>{
    const [current, setCurrent] = useState("mail");
    const [electronic, setElectronics] = useState([]);
    const [appliance, setAppliance] = useState([]);
    const [fashions, setFashions] = useState([]);
    const [homeinterior, setHomeInterior] = useState([]);
    const [footwears, setFootwears] = useState([]);
    const [toysmore, setToysMore] = useState([]);

    const [loading, setLoading] = useState(true);
    let toysmoreoptions = toysmore;
    useEffect(() => {
        getSubs();
    }, []);

    const getSubs = () =>{
        getCategoriesSub("614c1fefe32c6cc66266127e")
        .then(res =>{
            setElectronics(res.data);
        })
        getCategoriesSub("614c200fe32c6cc662661286")
        .then(res =>{
            setAppliance(res.data);
        })
        getCategoriesSub("614c1fdfe32c6cc66266127a")
        .then(res =>{
            setFashions(res.data);
        })
        getCategoriesSub("614c1ff7e32c6cc662661282")
        .then(res =>{
            setHomeInterior(res.data);
        })
        getCategoriesSub("614c2063e32c6cc66266129a")
        .then(res =>{
            setFootwears(res.data);
        })
        getCategoriesSub("614c201be32c6cc66266128e")
        .then(res =>{
            toysmoreoptions.push(res.data);
            setToysMore(res.data);
        })
        setLoading(false);
    };




    const handleClick = (e) => {
        setCurrent(e.key);
    }
        return(
        <div className="container">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={electronics} />}>
                        {!loading && (
                                <Menu.ItemGroup title="Electronics">
                                    {electronic.map((c) => (
                                        <Menu.Item key={c._id} ><Link to={`/subcategory/product/search/${c._id}`}>{c.name}</Link></Menu.Item>
                                    ))}
                                </Menu.ItemGroup>
                        )}
                        {loading && (
                            <Menu.Item key="setting:1" ><Skeleton active/></Menu.Item>
                        )}
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>


                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={appliances} />}>
                        {!loading && (
                                <Menu.ItemGroup title="Appliances">
                                    {appliance.map((c) => (
                                        <Menu.Item key={c._id} ><Link to={`/subcategory/product/search/${c._id}`}>{c.name}</Link></Menu.Item>
                                        ))}
                                </Menu.ItemGroup>
                        )}
                        {loading && (
                            <Menu.Item key="setting:1" ><Skeleton active/></Menu.Item>
                            )}
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>


                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={clothes} />}>
                        {!loading && (
                                <Menu.ItemGroup title="Fashions">
                                    {fashions.map((c) => (
                                        <Menu.Item key={c._id} ><Link to={`/subcategory/product/search/${c._id}`}>{c.name}</Link></Menu.Item>
                                        ))}
                                </Menu.ItemGroup>
                        )}
                        {loading && (
                            <Menu.Item key="setting:1" ><Skeleton active/></Menu.Item>
                            )}
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>


                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={interiors} />}>
                        {!loading && (
                                <Menu.ItemGroup title="Home Interiors">
                                    {homeinterior.map((c) => (
                                        <Menu.Item key={c._id} ><Link to={`/subcategory/product/search/${c._id}`}>{c.name}</Link></Menu.Item>
                                        ))}
                                </Menu.ItemGroup>
                        )}
                        {loading && (
                            <Menu.Item key="setting:1" ><Skeleton active/></Menu.Item>
                            )}
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>


                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={footwear} />}>
                        {!loading && (
                                <Menu.ItemGroup title="Footwear">
                                    {footwears.map((c) => (
                                        <Menu.Item key={c._id} ><Link to={`/subcategory/product/search/${c._id}`}>{c.name}</Link></Menu.Item>
                                        ))}
                                </Menu.ItemGroup>
                        )}
                        {loading && (
                            <Menu.Item key="setting:1" ><Skeleton active/></Menu.Item>
                            )}
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>


                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={toys} />}>
                        {!loading && (
                                <Menu.ItemGroup title="Toys and More">
                                    {toysmore.map((c) => (
                                        <Menu.Item key={c._id} ><Link to={`/subcategory/product/search/${c._id}`}>{c.name}</Link></Menu.Item>
                                        ))}
                                </Menu.ItemGroup>
                        )}
                        {loading && (
                            <Menu.Item key="setting:1" ><Skeleton active/></Menu.Item>
                            )}
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
