import styled from "styled-components"

const EditBox = styled.div`
    box-sizing: border-box;
    width: 35em;

    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;

    padding: 1.5em 2em;
`

export default EditBox
