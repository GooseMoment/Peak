import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Button from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"

import { states } from "@assets/themes"

import { useTranslation } from "react-i18next"

const ConfirmationSignOut = ({ onClose }) => {
    const navigate = useNavigate()
    const { t } = useTranslation("settings", { keyPrefix: "sign_out" })
    const [loading, setLoading] = useState(false)

    const onClickSignOut = () => {
        setLoading(true)
        navigate("/app/sign_out")
    }

    const buttons = [
        "close",
        <Button
            key="sign_out"
            $state={states.danger}
            onClick={onClickSignOut}
            disabled={loading}
            $loading={loading}>
            {t("yes")}
        </Button>,
    ]

    return (
        <Confirmation
            question={t("question")}
            buttons={buttons}
            onClose={onClose}
        />
    )
}

export default ConfirmationSignOut
