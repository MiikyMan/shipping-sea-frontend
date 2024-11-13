import Navbar from "../components/navbar"
import Products from "../components/products"
import Footer from "../components/footer"
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function search(){
    let query = useQuery();
    let searchName = query.get("name");
    console.log(searchName);
    return(
        <>
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <div className="page-container flex-grow p-4">
                <Products searchName={searchName}/>
            </div>
            <Footer/>
        </div>
        </>
    )
}

export default search