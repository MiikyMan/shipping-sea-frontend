import { useState } from "react"

const initDetails = [
    {title: "Screen Size",productDetail: "6.7 inch"},
    {title: "Chip",productDetail: "A17 Pro chip"},
    {title: "Display",productDetail: "Super Retina XDR display ProMotion technology Always-On display"},
    {title: "Capacity",productDetail: "256GB"},
    {title: "Front Camera",productDetail: "TrueDepth camera 12MP"},
    {title: "Back Camera",productDetail: "Pro camera system (48MP Main, 12MP Ultra Wide, and 12MP 5x Telephoto)"},
    {title: "Connection ports",productDetail: "USB-C"},
    {title: "SIM Card",productDetail: "Dual SIM (nano-SIM and eSIM)"},
]

function ProductDetails(){
    const [details, setDetails] = useState(initDetails)
    return(
        <>
            {
                    details.map((detail) => (
                        <div className="product-details-component">
                            <div className="product-details-component-title">{detail.title}</div>
                            <div className="product-details-component-detail">{detail.productDetail}</div>
                        </div>
                    ))
                }
        </>
    )
}

export default ProductDetails