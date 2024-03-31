import { useState } from "react"

import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"
import TitleFrame from "@components/project/common/TitleFrame"
import MiddleFrame from "@components/project/common/MiddleFrame"
import Color from "./Color"
import Type from "./Type"

const ProjectCreate = ({onClose}) => {
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {icon: "circle", color: 'FD99D9', display: "파랑", component: <Color closeComponent={closeComponent}/>},
        {icon: "award", display: "상시 프로젝트", component: <Type closeComponent={closeComponent}/>}
    ]

    return (
        <>
        <ProjectBox>
            <TitleFrame title="홍대라이프" icon="archive" onClose={onClose}/>
            <MiddleFrame items={items} isComponentOpen={isComponentOpen} setIsComponentOpen={setIsComponentOpen}/>
        </ProjectBox>
        </>
    )
}

const ProjectBox = styled.div`
    width: 35em;
    height: 11em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;

    transition: left 0.5s ${cubicBeizer}, width 0.5s ${cubicBeizer};
`

export default ProjectCreate