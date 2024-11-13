import { Rating } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import FilterIcon from "./assets/filter.svg";
import { baseURL } from './userIDConfig';
import { Button, Dropdown, Menu } from 'antd';

function RatingAndReviews(productOBJ: { productOBJ: any; }){
    let product = productOBJ.productOBJ;
    // console.log(product);
    // console.log("gg",product.name);
    const [reviews, setReviews] = useState([])
    const [comments, setComments] = useState([])
    const [productRating, setProductRating] = useState({ rating: 0 });
    console.log(reviews);

    const handleMenuClick = (e: { key: React.Key }) => {
        const key = e.key.toString();
        let sortedComments = [...comments];
        if (key === '2') {
          sortedComments.sort((a, b) => a.rating - b.rating);
        } else if (key === '3') {
          sortedComments.sort((a, b) => b.rating - a.rating);
        }
        setComments(sortedComments);
      };

    const menu = (
        <Menu onClick={handleMenuClick}>
          <Menu.Item key="1">Recent</Menu.Item>
          <Menu.Item key="2">Price: Ascending</Menu.Item>
          <Menu.Item key="3">Price: Descending</Menu.Item>
        </Menu>
    );

    useEffect(() => {
        const fetchProductData = async () => {
          try {
            const response = await axios.get(`${baseURL}/reviews/${product.productID}`);
            const commentsRes = await axios.get(`${baseURL}/reviews/comments/${product.productID}`);
            const totalRating = response.data.reduce((acc, review) => acc + (review.rating * review.ratingCount), 0);
            const totalCount = response.data.reduce((acc, review) => acc + review.ratingCount, 0);
            const averageRating = totalCount ? totalRating / totalCount : 0;
            setProductRating({ rating: averageRating });
            setReviews(response.data)
            setComments(commentsRes.data)
          } catch (error) {
            console.error("Error fetching cart data: ", error);
          }
        };
    
        if (product.productID) {
            fetchProductData();
            window.scrollTo(0, 0);
        }
    }, [product.productID]);

    const ratingCounts = Array(5).fill(0);
    reviews.forEach(review => {
        ratingCounts[review.rating - 1] += review.ratingCount;
    });

    const totalRatingCount = ratingCounts.reduce((acc, count) => acc + count, 0);
    console.log("log", reviews);
    console.log("ratingCounts", ratingCounts);

    const calculateReviewsAverage = () => {
        let average = reviews.reduce((acc,review) => {
            console.log("rating", review.rating);
            return acc + review.rating / totalRatingCount;
        },0);
        return average > 0 ? average.toFixed(1) : 0;
    }

    console.log("length", reviews.length);
    console.log("length123", totalRatingCount);
    return(
        <>
            <div className="flex ">
                <div className="flex flex-col justify-center items-center gap-2 p-8">
                    <div className="text-6xl font-semibold ">{productRating.rating.toFixed(1)}</div>
                    <Rating className="" name="half-rating-read" value={productRating.rating} precision={0.5} readOnly/>
                </div>
                <div className="flex flex-col justify-between p-2 w-full">
                    {[...ratingCounts].reverse().map((count, i) => {
                        return (
                            <div key={i} className="flex gap-2 items-center">
                                <div>{5 - i}</div>
                                <div className="flex-grow bg-gray-200 h-4 rounded-md overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-4 rounded-md transition-all duration-1000 ease-out"
                                        style={{ width: `${totalRatingCount !== 0 ? (count / totalRatingCount) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div>({count})</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="products-filter flex justify-end mr-6">
                <Dropdown overlay={menu} placement="bottomRight">
                    <Button>
                    Filter
                    <img src={FilterIcon} alt="Filter Icon"/>
                    </Button>
                </Dropdown>
            </div>
            <div className="p-6">
                {comments.map((comment, i) => (
                    <div key={i} className="flex mb-4 gap-6">
                        <div className="">
                            <img src={comment.profilePicUrl} className="w-24 aspect-square rounded-full border-0"/>
                        </div>
                        <div className="">
                            <div>
                                <Rating className="" name="half-rating-read" value={comment.rating} precision={0.5} readOnly/>
                            </div>
                            <div className="font-bold text-xl">
                                {comment.name}
                            </div>
                            <div className="text-lg">
                                "{comment.comment}"
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default RatingAndReviews