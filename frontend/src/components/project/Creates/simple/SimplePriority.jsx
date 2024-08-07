import { useState } from "react"

import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const SimplePriority = ({ inputRef }) => {
    const [priority, setPriority] = useState("보통")

    const onChange = (e) => {
        setPriority(e.target.value)
    }

    return (
        <Box>
            <FeatherIcon icon="alert-circle" />
            <VLine />
            <InputText
                type="text"
                onChange={onChange}
                value={priority}
                ref={inputRef}
                placeholder="우선순위를 설정해주세요."
            />
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;

    & svg {
        top: 0;
        width: 1.1em;
        height: 1.1em;
        margin-right: 0.8em;
    }
`

const VLine = styled.div`
    border-left: thin solid #d9d9d9;
    height: 1.3em;
    margin-right: 0.8em;
`

const InputText = styled.input`
    width: 36em;
    font-weight: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? "#A4A4A4" : "#000000")};
    border: none;
    margin-top: 0.1em;

    &:focus {
        outline: none;
    }
`

export default SimplePriority
