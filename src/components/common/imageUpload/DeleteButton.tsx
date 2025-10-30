import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components"

interface Deleteinterface {
    "data-index": number;
    setDeleteIdx: Dispatch<SetStateAction<number | undefined>>;
}

const Delete = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;
`

export default function DeleteButton({"data-index":i,setDeleteIdx}:Deleteinterface) {
    const handleDelete = (e:React.MouseEvent<HTMLButtonElement>):void => {
        setDeleteIdx(Number(e.currentTarget.dataset.index))

    }

    return (
        <Delete data-index={i} onClick={handleDelete}>닫어!</Delete>
    )
}