import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import FilterIcon from "./assets/filter.svg";
import HeartIcon from "./assets/heart.svg";
import RedHeartIcon from "./assets/redheart.svg";
import { Button, Dropdown, Menu } from 'antd';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '../context/authContext';
import { baseUser, baseURL } from './userIDConfig';

interface Product {
  productID: string;
  fullPrice: number;
  price: number;
  name: string;
  productPicUrl: string;
  rating: number;
  stock: number;
}

interface Favourite {
  uID: string;
  fID: string; // Should match the type of productID (string in this case)
  favouriteID: string;
}

interface ProductsProps {
  categoryName: string;
  searchName: string;
}

const Products: React.FC<ProductsProps> = ({ categoryName, searchName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]); // Store only productIDs
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { currentUser, uid } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>(`${baseURL}/categories/${categoryName}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSearchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>(`${baseURL}/categories/search/${searchName}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>(`${baseURL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
    } else if (searchName) {
      fetchSearchProducts();
    } else {
      fetchAllProducts();
    }
  }, [categoryName, searchName]);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (currentUser) {
        try {
          const response = await axios.get<Favourite[]>(`${baseURL}/favourites/${uid}`);
          const favouriteProductIDs = response.data.map(fav => fav.fID);
          setFavourites(favouriteProductIDs);
        } catch (error) {
          console.error('Error fetching favourites:', error);
        }
      }
    };

    fetchFavourites();
  }, [currentUser]);

  const toggleLike = async (productID: string) => {
    try {
      if (favourites.includes(productID)) {
        await axios.delete(`${baseURL}/favourites/${uid}/${productID}`);
        setFavourites(favourites.filter(fav => fav !== productID));
      } else {
        await axios.post(`${baseURL}/favourites/${uid}/${productID}`);
        setFavourites([...favourites, productID]);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleMenuClick = (e: { key: React.Key }) => {
    const key = e.key.toString();
    let sortedProducts = [...products];
    if (key === '2') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (key === '3') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  const calculateDiscountPercentage = (price: number, fullPrice: number) => {
    if (fullPrice <= 0) return 0;
    return ((fullPrice - price) / fullPrice * 100).toFixed(0);
  };

  const formatProductName = (name: string) => {
    return name.length > 15 ? name.slice(0, 14) + "..." : name;
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Recent</Menu.Item>
      <Menu.Item key="2">Price: Ascending</Menu.Item>
      <Menu.Item key="3">Price: Descending</Menu.Item>
    </Menu>
  );
  console.log(products);
  return (
    <div className="products-container">
      <div className="products-title-bar">
        <div className="products-title max-md:text-2xl">
          {categoryName ? categoryName : (searchName ? `Results of '${searchName}'` : 'Suggestion') }
        </div>
        <div className="products-filter max-md:w-1/4">
          <Dropdown overlay={menu} placement="bottomLeft">
            <Button>
              Filter
              <img src={FilterIcon} alt="Filter Icon" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="max-md:grid max-md:grid-cols-2 max-md:max-w-screen-lg max-md:mx-auto max-md:gap-3 flex flex-wrap justify-start gap-3">
        {loading ? (
          Array.from(new Array(10)).map((_, index) => (
            <div className="product" key={`skeleton-${index}`}>
              <Skeleton animation="wave" variant="rectangular" width={228} height={228} sx={{ borderRadius: '16px 16px 0px 0px' }} />
              <div className="product-desc">
                <Skeleton animation="wave" variant="text" width="200px" height="30px" />
                <Skeleton animation="wave" variant="text" width="70px" height="30px" />
              </div>
            </div>
          ))
        ) : (
          products.map((product, i) => (
            <div
              className="product max-md:max-h-64 md:shadow-lg"
              key={product.productID}
              onMouseEnter={() => setHoveredProduct(i)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link to={`/product/?productID=${product.productID}`} className="product-link">
                {calculateDiscountPercentage(product.price, product.fullPrice) !== "0" && (
                  <div className="product-discount">
                    -{calculateDiscountPercentage(product.price, product.fullPrice)}%
                  </div>
                )}
                <img className="product-img" src={product.productPicUrl} alt={product.name} />
                <div className="product-desc">
                  <div className="product-desc-top">
                    <div className="product-name-container">
                      <span className="product-name max-md:text-xl">
                        {hoveredProduct === i ? product.name : formatProductName(product.name)}
                      </span>
                    </div>
                    <div className="product-rating max-md:text-sm">
                      <Rating name="size-small" className="star max-md:scale-75" value={1} max={1} readOnly />
                      <div className="rating ">{product.rating}</div>
                    </div>
                  </div>
                  <div className="product-desc-bottom">
                    <div className="prices">
                      <div className="product-price max-md:text-xl">${product.price}</div>
                      {calculateDiscountPercentage(product.price, product.fullPrice) !== "0" && (
                        <div className="product-fullprice "><del>${product.fullPrice}</del></div>
                      )}
                    </div>
                    <div 
                      className="product-stock max-md:text-sm"
                    >
                      {product.stock} 
                      {/* in stock */}
                    </div>
                  </div>
                </div>
              </Link>
              {hoveredProduct === i && (
                <button className="product-heart max-md:scale-90" onClick={() => toggleLike(product.productID)}>
                  <img src={favourites.includes(product.productID) ? RedHeartIcon : HeartIcon} alt="Heart Icon" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
