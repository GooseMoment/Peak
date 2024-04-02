import FeatherIcon from "feather-icons-react"
import styled, { css } from "styled-components"
import MildButton from "@components/common/MildButton"

const Header = ({collapsed, setCollapsed}) => {
    return <header>
        <ButtonContainer $collapsed={collapsed}>
            <MildButton onClick={() => setCollapsed(previous => !previous)}>
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