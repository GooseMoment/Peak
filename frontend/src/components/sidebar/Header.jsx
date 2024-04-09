import { useEffect, useRef } from "react"

import MildButton from "@components/common/MildButton"
import { cubicBeizer } from "@assets/keyframes"
import useScreenSize from "@utils/useScreenSize"

import styled, { css, keyframes } from "styled-components"
import FeatherIcon from "feather-icons-react"

const autoCollapseWidth = 950

const Header = ({collapsed, setCollapsed}) => {
    const screenSize = useScreenSize()
    const previousScreenSize = useRef(screenSize)
    const autoControlled = useRef(true)

    useEffect(() => {
        if (previousScreenSize.current.width > autoCollapseWidth && screenSize.width <= autoCollapseWidth ) {
            // if screen width became shorter than autoCollapseWidth
            setCollapsed(true)
        }

        if (autoControlled.current && previousScreenSize.current.width <= autoCollapseWidth && screenSize.width > autoCollapseWidth) {
            // if screen width became longer than autoCollapseWidth
            setCollapsed(false)
        }

        previousScreenSize.current = screenSize
    }, [screenSize])

    const onClickCollapseButton = () => {
        setCollapsed(previous => {
            if (previous) { // It was collapsed, and user wants to expend 
                autoControlled.current = true
            } else { 
                autoControlled.current = false
            }

            return !previous
        })
    }

    return <header>
        <ButtonContainer $collapsed={collapsed}>
            <CollapseButton onClick={onClickCollapseButton} $collapsed={collapsed} >
                <FeatherIcon icon="chevrons-left" />
            </CollapseButton>
        </ButtonContainer>
    </header>
}

const ButtonContainer = styled.div`
display: flex;
justify-content: flex-end;
font-size: 1em;
padding: 0.75em 0 0.75em 0.5em;
margin: 0 0.75em;

${({$collapsed}) => $collapsed ? css`
    justify-content: center;
` : null}
`
const rotateToLeft = keyframes`
    0% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(0deg);
    }
`

const rotateToRight = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(180deg);
    }
`

const CollapseButton = styled(MildButton)`
    & svg {
        animation: ${rotateToLeft} 0.5s ${cubicBeizer} forwards;
    }

    ${props => props.$collapsed && css`
        & svg {
            animation: ${rotateToRight} 0.5s ${cubicBeizer} forwards;
        }
    `}
`

export default Header