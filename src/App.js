import './App.css';
import React, {useEffect} from "react";
import {Switch, Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Header from './components/nav/Header';
import RegisterComplete from './pages/auth/RegsiterComplete';
import ForgotPassword from './pages/auth/ForgotPassword';
import {auth} from "./firebase";
import {useDispatch} from "react-redux";
import { currentUser } from './functions/auth';
import History from './pages/user/History';
import UserRoute from './components/routes/UserRoute';
import Password from './pages/user/Password';
import Wishlist from './pages/user/Wishlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/routes/AdminRoute';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryUpdate from './pages/admin/category/CategoryUpdate';
import SubCategoryCreate from './pages/admin/subcategory/SubCategoryCreate';
import SubCategoryUpdate from './pages/admin/subcategory/SubCategoryUpdate';
import ProductCreate from './pages/admin/product/ProductCreate';
import BrandCreaate from './pages/admin/brand/BrandCreate';
import BrandUpdate from './pages/admin/brand/BrandUpdate';
import ProductList from './pages/admin/product/ProductList';
import ProductUpdate from './pages/admin/product/ProductUpdate';
import CouponCreate from './pages/admin/coupon/CouponCreate';
import Product from './pages/Product';
import Shop from './components/search/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ShowSubCategoryProduct from './components/search/ShowSubCategoryProduct';
import ShowCategoryProduct from './components/search/ShowCategoryProduct';
import SideDrawer from './components/drawer/sideDrawer';

const App = () => {
  const dispatch = useDispatch();

  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user);

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    // cleanup
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <>
    <Header />
    <SideDrawer />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/register" component={Register}></Route>
      <Route exact path="/register/complete" component={RegisterComplete}></Route>
      <Route exact path="/forgot/password" component={ForgotPassword}></Route>
      <Route exact path="/product/:slug" component={Product}></Route>
      <Route exact path="/shop" component={Shop}></Route>
      <Route exact path="/cart" component={Cart}></Route>
      <Route exact path="/subcategory/product/search/:subid" component={ShowSubCategoryProduct}></Route>
      <Route exact path="/category/product/search/:catid" component={ShowCategoryProduct}></Route>
      <UserRoute exact path="/checkout" component={Checkout}></UserRoute>
      <UserRoute exact path="/user/history" component={History}></UserRoute>
      <UserRoute exact path="/user/password" component={Password}></UserRoute>
      <UserRoute exact path="/user/wishlist" component={Wishlist}></UserRoute>
      <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}></AdminRoute>
      <AdminRoute exact path="/admin/category" component={CategoryCreate}></AdminRoute>
      <AdminRoute exact path="/admin/sub" component={SubCategoryCreate}></AdminRoute>
      <AdminRoute exact path="/admin/product" component={ProductCreate}></AdminRoute>
      <AdminRoute exact path="/admin/brand" component={BrandCreaate}></AdminRoute>
      <AdminRoute exact path="/admin/products" component={ProductList}></AdminRoute>
      <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate}></AdminRoute>
      <AdminRoute exact path="/admin/subcategory/:slug" component={SubCategoryUpdate}></AdminRoute>
      <AdminRoute exact path="/admin/brand/:id" component={BrandUpdate}></AdminRoute>
      <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate}></AdminRoute>
      <AdminRoute exact path="/admin/coupon/" component={CouponCreate}></AdminRoute>


    </Switch>
    </>
  );
}

export default App;
