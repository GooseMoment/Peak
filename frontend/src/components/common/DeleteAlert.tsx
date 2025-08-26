import Button from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"

import { useTranslation } from "react-i18next"

const DeleteAlert = ({
    title,
    onClose,
    func,
}: {
    title: string
    onClose: () => void
    func: () => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "project.delete" })

    const buttons = [
        <Button key="delete" form="filled" state="danger" onClick={func}>
            {t("button_delete")}
        </Button>,
    ]

    return (
        <Confirmation
            question={t("alert_question", { title: title })}
            onClose={onClose}
            buttons={buttons}
        />
    )
}

export default DeleteAlert
