import Navbar from "../components/navbar"
import Products from "../components/products"
import Footer from "../components/footer"
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function category(){
    let query = useQuery();
    let categoryName = query.get("name");
    console.log(categoryName);
    return(
        <>
        <div className="flex flex-col min-h-screen ">
            <Navbar/>
            <div className="page-container flex-grow pt-4 max-md:bg-white max-md:rounded-t-xl relative h-full w-full">
                <Products categoryName={categoryName}/>
            </div>
            <div className="max-md:bg-white bottom-0 z-0 w-full">
                <Footer/>
            </div>
        </div>
            {/* <Footer/> */}
        </>
    )
}

export default category