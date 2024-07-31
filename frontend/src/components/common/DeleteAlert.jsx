import styled from "styled-components"

import Button from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"

const DeleteAlert = ({ title, onClose, func }) => {
    const buttons = [
        "close", <Button $form="filled" $state="danger" onClick={func}>삭제</Button>
    ]

    return <Confirmation question={`${title} 삭제하시겠습니까?`} onClose={onClose} buttons={buttons} />
}

const DeleteAlertBox = styled.div`
    min-width: 20em;
    max-width: 25em;
    border: solid 1px ${p => p.theme.project.borderColor};
    border-radius: 15px;
    color: ${p => p.theme.textColor};
    white-space:pre-wrap;
    text-align: center;
    line-height: 1.2em;

    gap: 1.3em;
`

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
`

export default DeleteAlert