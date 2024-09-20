import { styled, css } from "styled-components"
import { rotateToUp, rotateToUnder, cubicBeizer } from "@assets/keyframes"
import FeatherIcon from "feather-icons-react"

const CollapseButton = ({ collapsed, handleCollapsed }) => {
    return (
        <CollapseButtonBox $collapsed={collapsed}>
            <FeatherIcon icon="chevron-down" onClick={handleCollapsed}/>
        </CollapseButtonBox>
    )
}

const CollapseButtonBox = styled.div`
    & svg {
        animation: ${rotateToUp} 0.5s ${cubicBeizer} forwards;
    }

    ${(props) =>
        props.$collapsed &&
        css`
            & svg {
                animation: ${rotateToUnder} 0.5s ${cubicBeizer} forwards;
            }
        `}
`

export default CollapseButton
