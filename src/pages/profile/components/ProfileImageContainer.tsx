import { useState } from "react"
import { Skeleton } from "../../../components/common/Skeleton";
import { ProfileImage, ProfileImageBox } from "./Profile.styled";

interface ProfileImage{
    src: string;
    alt: string;
    onError:(e:React.SyntheticEvent<HTMLImageElement>)=>void;
}

export default function ProfileImageContainer({src,alt,onError}:ProfileImage) {
    const [profileLoading,setProfileLoading] = useState(true)

    return(
        <ProfileImageBox>
            {profileLoading && <Skeleton></Skeleton>}
            <ProfileImage
            src={src}
            alt={alt}
            onError={onError}
            onLoad={()=>setProfileLoading(false)}
            style={{ display : profileLoading ? 'none' : 'inline-block' }}
            />
        </ProfileImageBox>
    )
}