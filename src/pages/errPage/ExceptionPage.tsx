import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled, {keyframes} from "styled-components";
import DefaultButton from "../../components/common/buttons/Button";
import {
    ErrPageSection,
    ErrorContent,
    ErrorMessage,
} from "./ErrPage.styled";

interface Exception {
    text: string;
    type: 'member' | 'guest'
}
const dropscale = keyframes `
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-30px);
        opacity: 0;
    }
`
const Drop = styled.img`
    position: absolute;
    top: -10px;
    animation: ${dropscale} 1.4s ease-in-out infinite;
`
const Drop2 = styled(Drop)`
    width: 35px;
    top: 25px;
    left: -20px;
    animation-delay: 0.2s;
`
const Drop3 = styled(Drop)`
    width: 25px;
    top: 0;
    left: -40px;
    animation-delay: 0.4s;
`

export default function ExceptionPage ({text,type}:Exception) {
    const [imageLoad,setImageLoad] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const fishImage = new Image();
        fishImage.src = '/img/fish-logo.svg'

        fishImage.onload = () => {
            setImageLoad(true)
        }
    },[])


    const handleGoFeed = () => {
        navigate('/feed');
    };

    const handleGoLogin = () => {
        navigate('/login')
    }

    return (
        <ErrPageSection>
            <h2 className="sr-only">로그인 확인 페이지</h2>
            <div style={{ position: 'relative' }}>
                {imageLoad &&
                <>
                <Drop src="/img/drop.png" />
                <Drop2 src="/img/drop.png" />
                <Drop3 src="/img/drop.png" />
                <img src="/img/fish-logo.svg" alt="물고기 로고" />
                </>
                }
                {!imageLoad &&
                <div style={{
                    width: '162px',
                    height: '163px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center' }}>
                    <div style={{
                        background: '#9bd0e2',
                        filter: 'blur(10px)',
                        width: '125px',
                        height: '125px',
                        opacity: '0.6',
                        borderRadius: '500px'
                    }}></div>
                </div>
                }
            </div>

            <ErrorContent>
                <ErrorMessage>{text}</ErrorMessage>
                {type === 'member' && (
                    <DefaultButton
                    text={"피드 보러가기"}
                    width={120}
                    onClick={handleGoFeed}
                    />
                )}
                {type === 'guest' && (
                    <DefaultButton
                    text={"로그인 하러가기"}
                    width={150}
                    onClick={handleGoLogin}
                    />
                )}
            </ErrorContent>
        </ErrPageSection>
    )
}