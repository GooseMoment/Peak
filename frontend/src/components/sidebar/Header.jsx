import FeatherIcon from "feather-icons-react"
import styled, { css } from "styled-components"

const Header = ({collapsed, setCollapsed}) => {
    return <header>
        <ButtonContainer $collapsed={collapsed}>
            <StyledButton onClick={() => setCollapsed(previous => !previous)}>
                <FeatherIcon icon={collapsed ? "chevrons-right" : "chevrons-left"} />
            </StyledButton>
        </ButtonContainer>
        {collapsed ? null : <LogoSkelton />}
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

const StyledButton = styled.button`
background: none;
color: inherit;
border: none;
padding: 0;
font: inherit;
cursor: pointer;
outline: inherit;
`

const LogoSkelton = styled.div`
margin: 1em;
width: auto;
height: 5em;
background-color: salmon;
`

export default Header