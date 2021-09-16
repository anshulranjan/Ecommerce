import React , {useState} from "react";
import { Menu} from 'antd';
import { MailOutlined, UserOutlined, SettingOutlined, ShoppingOutlined, LogoutOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
const { SubMenu } = Menu;

const Header = () => {
    const [current, setCurrent] = useState("home");
    let dispatch = useDispatch();
    let history = useHistory();
    const handleClick = (e) => {
        setCurrent(e.key);
    }
    const logout = () => {
      const auth = getAuth();
      signOut(auth)
      dispatch({
        type: "LOGOUT",
        payload: null,
      })
      history.push("/login");
    }
    return(
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"> 
        <Menu.Item key="home" icon={<ShoppingOutlined />}>
          <Link to="/">ShopMe</Link>
        </Menu.Item>

        <Menu.Item key="login" icon={<UserOutlined />} className="float-right">
        <Link to="/login">Login</Link>
        </Menu.Item>

        <Menu.Item key="register" icon={<UserOutlined />} className="float-right">
        <Link to="/register">Register</Link>
        </Menu.Item>


        <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Users">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
            <Menu.Item icon={<LogoutOutlined /> } onClick = {logout}>Logout</Menu.Item>

        </SubMenu>
      </Menu>
    )

}
export default Header;