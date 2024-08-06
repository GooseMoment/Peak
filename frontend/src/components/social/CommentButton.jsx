import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import MildButton from "@components/common/MildButton"

const CommentButton = ({parentType, parent}) => {
    return <ButtonBox>
        <FeatherIcon icon={'message-square'}/>
    </ButtonBox>
}

const ButtonBox = styled(MildButton)`
    height: 2em;
    width: 1.5em;

    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
        top: unset;
        margin-right: unset;
    }
`

export default CommentButton