import { useEffect, useRef } from "react"

import useScreenSize from "@utils/useScreenSize"

import FeatherIcon from "feather-icons-react"
import styled, { css } from "styled-components"
import MildButton from "@components/common/MildButton"

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
            <MildButton onClick={onClickCollapseButton}>
                <FeatherIcon icon={collapsed ? "chevrons-right" : "chevrons-left"} />
            </MildButton>
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

export default Header