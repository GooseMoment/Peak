import styled from "styled-components"
import DetailFrame from "./DetailFrame"

import { useRouteLoaderData } from "react-router-dom"
import { Fragment } from "react"
import FeatherIcon from "feather-icons-react"

const Drawer = ({ onClose }) => {
    const {projects} = useRouteLoaderData("app")

    return (
        <DetailFrame title="서랍 선택" onClose={onClose}>
            {projects.map((project) => (
                <Fragment key={project.id}>
                    <ItemBox>
                        <Circle $color={project.color}/>
                        <ItemText $is_project={true}>{project.name}</ItemText>
                    </ItemBox>
                    {project.drawers && project.drawers.map(drawer => (
                        <ItemBox key={drawer.id}>
                            <FeatherIcon icon="arrow-right"/>
                            <ItemText $is_project={false}>{drawer.name}</ItemText>
                        </ItemBox>
                    ))}
                </Fragment>
            ))}
        </DetailFrame>
    )
}

const Circle = styled.div`
    position: relative;
    width: 1.1em;
    height: 1.1em;
    background-color: #${props => props.$color};
    border-radius: 50%;
    margin-right: 0.6em;
`

const ItemBox = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        margin-left: 1.3em;
        top: 0;
    }
`

const ItemText = styled.div`
    font-weight: ${props => props.$is_project ? '500' : 'normal'};
    font-size: 1em;
    color: #000000;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

export default Drawer