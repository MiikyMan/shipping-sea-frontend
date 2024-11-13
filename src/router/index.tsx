import { Outlet, createBrowserRouter } from 'react-router-dom'
import Home from "../pages/home"
import Product from '../pages/product'
import Signin from '../pages/signin'
import Signup from '../pages/signup'
import ShoppingCart from '../pages/shoppingcart'
import Profile from '../pages/profile'
import Login from '../pages/login'
import Upload from '../components/upload/upload'
import Category from '../pages/category'
import Search from '../pages/search'
import Test from '../pages/test'
import CheckOut from '../pages/checkOut'
import Payment from '../pages/payment'

export const router = createBrowserRouter([
    {
      path: '/home',
      element: (
        <div>
          <Home/>
        </div>
      ),
    },
    {
      path: '/product',
      element: (
        <div>
          <Product/>
        </div>
      ),
    },
    {
      path: '/payment',
      element: (
        <div className="flex justify-center items-center h-svh">
          <Payment/>
        </div>
      ),
    },
    {
      path: '/signin',
      element: (
        <div>
          <Signin/>
        </div>
      ),
    },
    {
      path: '/signup',
      element: (
        <div>
          <Signup/>
        </div>
      ),
    },
    {
      path: '/shoppingcart',
      element: (
        <div>
          <ShoppingCart/>
        </div>
      ),
    },
    {
      path: '/checkout',
      element: (
        <div>
          <CheckOut/>
        </div>
      ),
    },
    {
      path: '/profile',
      element: (
        <div>
          <Profile/>
        </div>
      ),
    },
    {
      path: '/login',
      element: (
        <div>
          <Login/>
        </div>
      ),
    },
    {
      path: '/upload',
      element: (
        <div>
          <Upload/>
        </div>
      ),
    },
    {
      path: '/category',
      element: (
        <div>
          <Category/>
        </div>
      ),
    },
    {
      path: '/search',
      element: (
        <div>
          <Search/>
        </div>
      ),
    },
    {
      path: '/kuay',
      element: (
        <div>
          <Test/>
        </div>
      ),
    },
])