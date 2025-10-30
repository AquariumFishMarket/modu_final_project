import styled from "styled-components"

interface imgcontainer {
    type: 'post' | 'profile';
    imgArr: File[]
}

//이미지 여러개일 때
const ContainerArr = styled.ul`
    margin-top: 13px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    gap: 0;
`
const ImageListArr = styled.li`
    width: 50%;
    border-radius: 10px;
    overflow: hidden;
    flex: 0 0 auto;
    aspect-ratio: 168 / 126;
    margin-right: 8px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`
//단일 이미지일 때 (post / profile 공통 컴포넌트 사용)
const ContainerSolo = styled.div<{type:string}>`
    width: 100%;
    height: ${(props)=>props.type === 'profile' ? '100%' : 'auto'};
    border-radius: ${(props)=>props.type === 'profile' ? '100%' : '20px'};
    overflow: hidden;
`
const ImageSolo = styled.div`
    height: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

export default function ImageContainer({type,imgArr}:imgcontainer) {
    const LastImageIdx = imgArr[imgArr.length - 1];

    if(type === 'post') {
        return (
            <>
            {imgArr.length < 2 && (
                <ContainerSolo type={type}>
                    {
                        imgArr.map((imgele,i)=>(
                            <ImageSolo key={i}>
                                <img
                                src={URL.createObjectURL(imgele)}
                                alt={`preview-${i}`}
                                ></img>
                            </ImageSolo>
                        ))
                    }
                </ContainerSolo>
            )}
            {imgArr.length > 1 && (
                <ContainerArr>
                    {
                        imgArr.map((imgele,i)=>(
                            <ImageListArr key={i}>
                                <img
                                src={URL.createObjectURL(imgele)}
                                alt={`preview-${i}`}
                                ></img>
                            </ImageListArr>
                        ))
                    }
                </ContainerArr>
            )}
            </>
        )
    }
    if(type === 'profile') {
        return (
            <>
            {LastImageIdx && (
                <ContainerSolo type={type}>
                    <ImageSolo>
                        <img
                        src={URL.createObjectURL(LastImageIdx)}
                        alt={`나의 프로필`}
                        ></img>
                    </ImageSolo>
                </ContainerSolo>
            )}
            </>
        )
    }

}