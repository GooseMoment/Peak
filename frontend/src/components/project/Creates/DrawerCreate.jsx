import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"
import TitleFrame from "@components/project/common/TitleFrame"
import MiddleFrame from "@components/project/common/MiddleFrame"

const DrawerCreate = ({onClose}) => {
    return (
        <DrawerBox>
            <TitleFrame title="수강신청" icon="inbox" onClose={onClose}/>
            <MiddleFrame items={items}/>
        </DrawerBox>
    )
}

const DrawerBox = styled.div`
    width: 35em;
    height: 8em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;

    transition: left 0.5s ${cubicBeizer}, width 0.5s ${cubicBeizer};
`

const items = [
    {icon: "server", display: "전체공개"},
]

export default DrawerCreate