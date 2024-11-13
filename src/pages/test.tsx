import Categories from "../components/categories"
import Navbar from "../components/navbar"
import Products from "../components/products"
import Footer from "../components/footer"
import Ads from "../components/adsSildeShow/adsSlideShow"

function Test(){
    return(
        <>
            <Navbar/>
            <Ads/>
            <div 
                className="mt-3 page-container max-md:w-full max-md:bg-white max-md:px-10"
                style={{borderRadius: '40px'}}    
            >
                <Categories/>
                <Products/>
            </div>
            {/* <Footer/> */}
        </>
    )
}

export default Test