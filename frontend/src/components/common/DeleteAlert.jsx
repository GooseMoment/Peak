import styled from "styled-components"

import Button from "@components/common/Button"

const DeleteAlert = ({ title, onClose, func }) => {
    return (
        <DeleteAlertBox>
            해당 {title} 삭제하시겠습니까?
            <FlexBox>
                <Button onClick={onClose}>취소</Button>
                <Button $form="filled" $state="danger" onClick={func}>삭제</Button>
            </FlexBox>
        </DeleteAlertBox>
    )
}

const DeleteAlertBox = styled.div`
    width: 25em;
    height: 8em;
    background-color: ${p => p.theme.backgroundColor};
    border: solid 1px ${p => p.theme.project.borderColor};
    border-radius: 15px;
    color: ${p => p.theme.textColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.3em;
`

const FlexBox = styled.div`
    display: flex;
    gap: 1em;
`

export default DeleteAlert