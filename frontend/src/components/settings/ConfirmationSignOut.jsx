import { useNavigate } from "react-router-dom"

import Button from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"

import { states } from "@assets/themes"

const ConfirmationSignOut = ({ onClose }) => {
    const navigate = useNavigate()

    const onClickSignOut = () => {
        navigate("/app/sign_out")
    }

    const buttons = [
        "close",
        <Button key="sign_out" $state={states.danger} onClick={onClickSignOut}>
            로그아웃
        </Button>,
    ]

    return (
        <Confirmation
            question="로그아웃 하시겠습니까?"
            buttons={buttons}
            onClose={onClose}
        />
    )
}

export default ConfirmationSignOut
