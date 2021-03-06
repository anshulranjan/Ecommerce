import React , {useState} from "react";
import { Menu, Badge} from 'antd';
import { UserOutlined, ShoppingOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "../search/Search";
const { SubMenu } = Menu;

const Header = () => {
    const a = window.location.href.split(process.env.REACT_APP_URL)[1]
    const [current, setCurrent] = useState(a);
    let dispatch = useDispatch();
    let {user, cart} = useSelector((state) => ({...state}))
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
        <Menu.Item key="/" icon={<ShoppingOutlined />}>
          <Link to="/">ShopMe</Link>
        </Menu.Item>
        <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
          <Link to="/cart"> 
            <Badge count={cart.length} offset={[9,0]}>
              Cart 
            </Badge>
            </Link>
        </Menu.Item>
        {!user && (
          <Menu.Item key="/login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
          </Menu.Item>
        )}

        {!user && (
          <Menu.Item key="/register" icon={<UserOutlined />} className="float-right">
          <Link to="/register">Register</Link>
          </Menu.Item>
        )}
        { user && (
          <SubMenu key="SubMenu" icon={<UserOutlined />} title={user.email && user.email.split('@')[0]} className="float-right">
              {user && user.role === "subscriber" && (<Menu.Item key="setting:1"><Link to="/user/history">Dashboard</Link></Menu.Item>)}
              {user && user.role === "admin" && (<Menu.Item key="setting:1"><Link to="/admin/dashboard">Dashboard</Link></Menu.Item>)}
              <Menu.Item key="setting:2">Option 2</Menu.Item>
              <Menu.Item icon={<LogoutOutlined /> } onClick = {logout}>Logout</Menu.Item>

          </SubMenu>
        )}
        <span className="float-right p-1">
          <Search/>        
        </span>
      </Menu>
    )

}
export default Header;