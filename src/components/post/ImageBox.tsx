import { useEffect, useState } from "react";
import { Skeleton } from "../common/Skeleton";
import { LoadSkeleton } from "./postCard/PostCard.styled";

interface ImageBox{
    src: string;
    alt?: string;
    onError:(e:React.SyntheticEvent<HTMLImageElement>)=>void;
}

export default function ImageBox({src,alt,onError}:ImageBox) {

    const [isLoading,setIsLoading] = useState(false);

    return(
        <>
        {!isLoading &&
            <LoadSkeleton>
                <Skeleton></Skeleton>
            </LoadSkeleton>
        }
            <img
            src={src}
            alt={alt || "게시글 이미지"}
            style={{ display : !isLoading ? 'none' : 'inline-block' }}
            onLoad={()=>setIsLoading(true)}
            onError={onError}
            />
        </>
    )
}