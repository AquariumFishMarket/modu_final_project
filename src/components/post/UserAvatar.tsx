import { useState } from "react";
import { UserAvatar } from "./PostHeader.styled"
import { Skeleton } from "../common/Skeleton";
import { EmptyUserAvatar } from "./PostHeader.styled";

interface UserAvatar{
    src?: string;
    alt?: string;
    onError:()=>void;
    variant: 'post' | 'comment';
}

export default function UserAvatarBox({src,alt,onError,variant}:UserAvatar) {

    const [avataLoading,setAvataLoading] = useState(false)

    return(
        <>
            {!avataLoading && (
                <EmptyUserAvatar $variant={variant}><Skeleton /></EmptyUserAvatar>
            )}
            <UserAvatar
                src={src || "/img/fish-logo-GB.png"}
                alt={alt}
                onError={onError}
                style={{ display: avataLoading ? 'inline-block' : 'none' }}
                onLoad={()=>setAvataLoading(true)}
                $variant={variant}
            />
        </>
    )
}