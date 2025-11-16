import { useState } from "react";
import { ProductImageBox, ProductImage } from "./SellingProducts.styled"
import { Skeleton } from "../../../components/common/Skeleton";

interface ProductImage{
    src: string;
    alt: string;
    onError:(e:React.SyntheticEvent<HTMLImageElement>)=>void;
}

export default function ProductImageContainer({src,alt,onError}:ProductImage) {
    const [productLoading,setProductLoading] = useState(true)

    return(
        <>
        <ProductImageBox>
        {productLoading && <Skeleton />}
        <ProductImage
            src={src}
            alt={alt}
            onError={onError}
            onLoad={()=>setProductLoading(false)}
            style={{ display: productLoading ? 'none' : 'inline-block' }}
        />
        </ProductImageBox>
        </>
    )
}