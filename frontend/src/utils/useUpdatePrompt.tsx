import { Suspense, useEffect, useRef } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import { useTranslation } from "react-i18next"
import { type Id, toast } from "react-toastify"
import { useRegisterSW } from "virtual:pwa-register/react"

export default function useUpdatePrompt() {
    const toastID = useRef<null | Id>(null)
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onOfflineReady() {
            toast.info("app ready to work offline!")
        },
    })

    const hide = () => {
        if (!toastID.current) {
            return
        }

        toast.dismiss(toastID.current)
    }

    useEffect(() => {
        if (!needRefresh) {
            return
        }

        toastID.current = toast.info(
            <Suspense key="use-update-prompt" fallback={null}>
                <Prompt
                    onClickUpdate={() => updateServiceWorker()}
                    onClickIgnore={hide}
                />
            </Suspense>,
            {
                autoClose: false,
                toastId: "use-update-prompt-need-refresh",
                closeButton: false,
            },
        )
    }, [needRefresh])
}

interface PromptProp {
    onClickUpdate: () => void
    onClickIgnore: () => void
}

const Prompt = ({ onClickUpdate, onClickIgnore }: PromptProp) => {
    const { t } = useTranslation("translation")

    return (
        <PromptBox>
            <p>{t("update.message")}</p>
            <ButtonWrapper>
                <Button onClick={onClickIgnore}>{t("update.no")}</Button>
                <Button onClick={onClickUpdate}>{t("update.yes")}</Button>
            </ButtonWrapper>
        </PromptBox>
    )
}

const PromptBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const ButtonWrapper = styled.div`
    display: flex;
`

const Button = styled(MildButton)`
    text-decoration: underline;
    padding: 0.5em;
    font-weight: 600;
`
