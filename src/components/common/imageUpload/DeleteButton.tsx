import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components"

interface Deleteinterface {
    "data-index": number;
    setDeleteIdx: Dispatch<SetStateAction<number | undefined>>;
}

const Delete = styled.button`
    width: 22px;
    height: 22px;
    background-color:transparent;
    border:unset;
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 999;
    background-color: #fff;
    border-radius: 100%;
`

export default function DeleteButton({"data-index":i,setDeleteIdx}:Deleteinterface) {
    const handleDelete = (e:React.MouseEvent<HTMLButtonElement>):void => {
        setDeleteIdx(Number(e.currentTarget.dataset.index))
    }

    return (
        <Delete data-index={i} onClick={handleDelete}>
            <img src="/img/icon-close.svg?" alt="닫기" />
        </Delete>
    )
}