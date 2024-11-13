import Navbar from "../components/navbar"
import Products from "../components/products"
import { Breadcrumb } from 'antd';
import HeartIcon from "../components/assets/heart.svg"
import RedHeartIcon from "../components/assets/redheart.svg"
import Iphone from "../components/mockuppics/iphone.png"
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import ProductDetails from "../components/productDetails";
import { IconButton, Rating } from "@mui/material";
import Share from "../components/share";
import Button from '@mui/material/Button';
import Footer from "../components/footer"
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUser, baseURL } from '../components/userIDConfig';
import RatingAndReviews from "../components/ratingAndReviews";
import Cart from '../components/assets/cart.svg'
import { Badge } from 'antd';
import { useAuth } from '../context/authContext';

async function getCartQuantity() {
    const res = await fetch(`${baseURL}/users/${uid}`);
    return res.json();
}

interface productType {
    productPicUrl: string;
    name: string;
    fullPrice: number;
    price: number;
    productID: string;
    rating: number;
    stock: number;
    sales: number;
    tags: string;
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const onChange = (key: string) => {
    console.log(key);
};

interface usersType {
    userID: string;
    name: string;
    email: string;
    role: string;
    profilePicUrl: string;
    rank: number;
    total_productID: number;
}

function product() {
    const [product, setProduct] = useState<productType[]>([]);
    let query = useQuery();
    let URLproductID = query.get("productID");
    const [data, setData] = useState<usersType | null>(null);
    const [qty, setQty] = useState(1);
    const [clicked, setClicked] = useState(false);
    const [cart, setCart] = useState([]);
    console.log(URLproductID);
    console.log("🚀 ~ product ~ qty:", qty);
    const {uid} = useAuth();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Product details',
            children: <ProductDetails />,
        },
        {
            key: '2',
            label: 'Rating and Reviews',
            children: <RatingAndReviews productOBJ={product[0]} />,
        },
    ];

    const handleIncrement = () => {
        setQty(qty + 1);
    };

    const handleDecrement = () => {
        setQty(qty - 1);
    };


    console.log("pID",URLproductID)

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // const result = await axios.get(`${baseURL}/users/${uid}`);
                // if (result) {
                //     setData(result[0]?.total_productID);
                //     console.log("Cart Quantity: ", result[0]);
                // }

                const response = await axios.get(`${baseURL}/products/${URLproductID}`);
                setProduct(response.data);
                console.log("testest",response.data);

                const getCartData = await axios.get(`${baseURL}/carts/${uid}`);
                const cartitems = getCartData.data;

                const cartData = cartitems.map(data => data.productID);
                setCart(cartData);

            } catch (error) {
                console.error("Error fetching cart data: ", error);
            }
        };

        if (URLproductID) {
            fetchProductData();
            window.scrollTo(0, 0);
        }
    }, [URLproductID]);

    console.log("hah", data);
    // console.log("rating",(product[0]?.rating));
    const value: number = product[0]?.rating + 0; //idk y but it works😭

    const handleAddtocart = async (productID: any, qty: number) => {
        console.log("productIDvv",productID);
        console.log("qty",qty);
        try {
            await axios.post(`${baseURL}/carts/add/${uid}/${productID}/${qty}`);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
        if (cart.includes(product[0]?.productID)) {
            setClicked(true);
        } else if (!clicked) {
            setData(data + 1);
            setClicked(true);
        }
    }

    console.log("cart", cart);
    console.log("cart", product[0]?.productID);

    return (
        <>
            <Navbar />
            <div className="page-container ">
                <div className="bread-nav max-md:hidden">
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: 'Home',
                                href: '/home',
                            },
                            {
                                title: product[0]?.name,
                            },
                        ]}
                    />
                </div>
                <div className="product-container max-md:flex-col max-md:h-fit">
                    <div className="md:hidden bg-gradient-to-t from-white to-transparent h-8 "></div>
                    <div className="product-container-left max-md:w-full max-md:pb-11">
                        <div className="main-pic max-md:mx-auto aspect-square">
                            <img src={product[0]?.productPicUrl} />
                        </div>
                        <div className="sub-pic max-md:hidden ">
                            <img src={product[0]?.productPicUrl} />
                            <img src={product[0]?.productPicUrl} />
                        </div>
                        <div className=" max-md:hidden ">
                            <Share />
                        </div>
                    </div>
                    <div className="product-container-right max-md:p-0 max-md:px-5 max-md:w-full">
                        <div className="product-share">
                            {/* <img src={ShareIcon}/> */}
                            {/* <Share/> */}
                        </div>
                        <div className="product-page-row1 max-md:hidden ">
                            <div className="product-page-name">{product[0]?.name}</div>
                            <div className="product-page-id">Product Code: {product[0]?.productID}</div>
                        </div>
                        <div className="product-page-row2">
                            <div className="product-page-price max-md:text-4xl max-md:text-blue-300">${product[0]?.price.toFixed(2)}</div>
                            {/* <Rating className="rating-star " name="half-rating-read" value={value} precision={0.5} readOnly/> */}

                            {/* can't fix :( */}
                            <div className="rating ">{value}</div>
                        </div>
                        <div className="product-page-row1 md:hidden">
                            <div className="product-page-name max-md:text-3xl max-md:font-semibold">{product[0]?.name}</div>
                            <div className="product-page-id">Product Code: {product[0]?.productID}</div>
                        </div>
                        <div className="product-page-row3">
                            {/* <div className="product-page-option">{product[0]?.stock}</div> */}
                        </div>
                        <div className="product-page-row4">
                            <div className="product-page-qty"></div>
                        </div>
                        <div className="product-qty">
                            <div>Quantity</div>
                            <div className="product-qty-btn">
                                <Button className="product-qty-decrement-btn" onClick={handleDecrement} disabled={qty <= 1} variant="outlined" sx={{ borderRadius: '10px 0px 0px 10px', height: '34px' }}>-</Button>
                                <div className="product-qty-text">{qty}</div>
                                <Button onClick={handleIncrement} variant="outlined" sx={{ borderRadius: '0px 10px 10px 0px', height: '34px' }}>+</Button>
                            </div>
                            <div>{product[0]?.stock} pieces available</div>
                        </div>
                        <div className="max-md:hidden">
                            <div className="product-page-row5">
                                <Button className="product-page-cart" variant="contained" onClick={() => handleAddtocart(product[0]?.productID, qty)} sx={{
                                    borderRadius: 3,
                                    height: 60,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    bgcolor: '#5AB2FF',
                                    ':hover': {
                                        bgcolor: '#4798CC',
                                        color: 'white',
                                    },
                                }}
                                >
                                    Add to cart
                                </Button>
                                <Button className="product-page-buy" variant="contained" sx={{
                                    borderRadius: 3,
                                    height: 60,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    bgcolor: '#0f8fff',
                                    ':hover': {
                                        bgcolor: '#0e65b1',
                                        color: 'white',
                                    },
                                }}
                                >
                                    Buy now
                                </Button>
                                <div className="product-page-like">
                                    <button className="product-page-like-btn" onClick={(e) => { e.stopPropagation(); }}>
                                        <img src={product[0]?.like === 1 ? RedHeartIcon : HeartIcon} alt="Heart Icon" />
                                    </button>
                                    1.2M
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="product-page-detail-container">
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                    />
                </div>
                <div className="bg-gradient-to-t from-blue-400 via-blue-400 to-blue-50 rounded-3xl px-5 mt-3 py-1 md:hidden max-md:pb-40">
                    <Products />
                </div>
                <div className="max-md:hidden max-md:pb-40">
                    <Products />
                </div>
            </div>
            {/* <Footer /> */}
            <div className="md:hidden fixed bottom-0 flex justify-between w-full min-h-24 items-center px-3 gap-2 rounded-b-2xl rotate-180 shadow-sm bg-white">
                <div className="h-3/4 flex justify-center items-center rounded-2xl w-2/5 rotate-180 ">
                    <Button className="product-page-buy" variant="contained" sx={{
                        borderRadius: 3,
                        height: 60,
                        fontSize: 15,
                        fontWeight: 'bold',
                        bgcolor: '#0f8fff',
                        ':hover': {
                            bgcolor: '#0e65b1',
                            color: 'white',
                        },
                    }}
                    >
                        Buy now
                    </Button>
                </div>
                <div className="h-3/4 flex justify-center items-center rounded-2xl w-2/5 rotate-180 ">
                    <Button className="product-page-cart" variant="contained" onClick={() => handleAddtocart(product[0]?.productID, qty)} sx={{
                        borderRadius: 3,
                        height: 60,
                        fontSize: 15,
                        fontWeight: 'bold',
                        bgcolor: '#5AB2FF',
                        ':hover': {
                            bgcolor: '#4798CC',
                            color: 'white',
                        },
                    }}
                    >
                        Add to cart
                    </Button>
                </div>
                <Link to="/shoppingcart" className="h-3/4 flex justify-center items-center rounded-2xl w-1/5 rotate-180">
                    <IconButton>
                        <img src={Cart} className="w-10" alt="Cart" />
                        <Badge count={data} overflowCount={99} offset={[10, 0]} className="cart-badge" />
                    </IconButton>
                </Link>
            </div>
        </>
    )
}

export default product