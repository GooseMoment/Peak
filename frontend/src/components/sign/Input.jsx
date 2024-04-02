import styled, { css } from "styled-components"

const Input = props => {
    const icon = props.icon
    const inputProps = (({icon, ...others}) => ({...others}))(props) // remove key "icon" from props and clone

    return (
        <Box>
            <StyledInput $hasIcon={icon ? true : false} {...inputProps} />
            {icon ? <IconBox>{icon}</IconBox> : null}
        </Box>
    )
}

const Box = styled.p`
    position: relative;
    font-size: 1rem;

    box-sizing: border-box;
    clear: both;
`

const StyledInput = styled.input`
    width: 100%;
    padding: 0.75em 1.25em;
    border: 1px solid #FE4902;
    border-radius: 5000px;
    
    box-sizing: border-box;

    font-size: inherit;

    ${props => props.$hasIcon ? css`
        padding-left: 2.5em;
    ` : null}
`

const IconBox = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 0;
    left: 1em;
    height: 100%;

    & svg, & img {
        height: 1em;
    }
`

export default Input