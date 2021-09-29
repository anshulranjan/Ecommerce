import React, {useState} from "react";
import { Row, Col, Menu, Avatar } from 'antd';
import electronics from "./Electronics.png";
import footwear from "./Footwear.png";
import clothes from "./Clothes.png";
import appliances from "./Appliance.png";
import interiors from "./Interiors.png";
import toys from "./Toys.png"
const { SubMenu } = Menu;
const style = { padding: '8px 0' };
export const HomeSubMenu = () =>{
    const [current, setCurrent] = useState("mail");
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
                        <Menu.ItemGroup title="Electronics">
                                <Menu.Item key="setting:1" >Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={appliances} />}>
                        <Menu.ItemGroup title="Appliances">
                                <Menu.Item key="setting:1" >Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={clothes} />}>
                        <Menu.ItemGroup title="Fashion">
                                <Menu.Item key="setting:1" >Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={interiors} />}>
                        <Menu.ItemGroup title="Home Interiors">
                                <Menu.Item key="setting:1" >Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={footwear} />}>
                        <Menu.ItemGroup title="Footwears">
                                <Menu.Item key="setting:1" >Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div style={style}>
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
                        <SubMenu key="SubMenu" icon={<Avatar size={64} shape="square" src={toys} />}>
                        <Menu.ItemGroup title="Toys and More">
                                <Menu.Item key="setting:1" >Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
