import styled from "styled-components";
import { Skeleton } from "./Skeleton";

interface SkeletonProps{
    width?: number;
    height: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    borderRadius?: number;
}

interface SkeletonStyleProps {
    $width?: number;
    $height: number;
    $marginTop?: number;
    $marginBottom?: number;
    $marginLeft?: number;
    $marginRight?: number;
    $borderRadius?: number;
}

const SkeletonContainer = styled.div<SkeletonStyleProps>`
    width: ${({ $width }) => $width ? `${$width}px` : '`100%' };
    height: ${({ $height }) => $height}px;
    margin-top: ${({ $marginTop }) => $marginTop ?? 0}px;
    margin-bottom: ${({ $marginBottom }) => $marginBottom ?? 0}px;
    margin-left: ${({ $marginLeft })=> $marginLeft ?? 0}px;
    margin-right: ${({ $marginRight })=> $marginRight ?? 0}px;
    border-radius: ${({ $borderRadius })=> $borderRadius ?? 0}px;
    overflow: hidden;
`

export default function SkeletonWrapper({...props}:SkeletonProps) {
    return(
        <SkeletonContainer
            $width={props.width}
            $height={props.height}
            $marginTop={props.marginTop}
            $marginBottom={props.marginBottom}
            $marginLeft={props.marginLeft}
            $marginRight={props.marginRight}
            $borderRadius={props.borderRadius}
        >
            <Skeleton />
        </SkeletonContainer>
    )
}