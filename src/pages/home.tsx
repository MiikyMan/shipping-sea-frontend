import Ads from "../components/adsSildeShow/adsSlideShow"
import Categories from "../components/categories"
import Navbar from "../components/navbar"
import Products from "../components/products"
import Footer from "../components/footer"

function home(){
    return(
        <>
            <div className="max-md:hidden">
                <Navbar/>
                <Ads/>
            </div>
            <div className="page-container max-md:hidden">
                <Categories/>
                <Products/>
            </div>
            <div className="bg-gradient-to-l from-blue-400/80 via-blue-300/50 to-blue-200 md:hidden">

                <Navbar/>
                <div className="mb-4">
                    <Ads/>
                </div>
                <div className="bg-white rounded-t-3xl px-5 mt-1 py-1 md:hidden pb-60 h-full relative">
                    <div className="mt-4">
                        <Categories/>
                    </div>
                    <Products/>
                    <div className="bg-transparent absolute left-0 bottom-0 z-0 w-full">
                        <Footer/>
                    </div>
                </div>
            </div>
            <div className="max-md:hidden">
                <Footer/>
            </div>
        </>
    )
}

export default home