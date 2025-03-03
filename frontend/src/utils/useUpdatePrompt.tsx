import { Suspense, useEffect, useRef } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import { useTranslation } from "react-i18next"
import { type Id, toast } from "react-toastify"
import { useRegisterSW } from "virtual:pwa-register/react"

export default function useUpdatePrompt() {
    const toastID = useRef<null | Id>(null)
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW()

    useEffect(() => {
        if (!needRefresh) {
            if (toastID.current) {
                toast.dismiss(toastID.current)
                toastID.current = null
            }

            return
        }

        toastID.current = toast(
            <Suspense key="use-update-prompt" fallback={null}>
                <Prompt
                    onClickUpdate={() => updateServiceWorker()}
                    onClickIgnore={() => setNeedRefresh(false)}
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
            <Message>{t("update.message")}</Message>
            <ButtonWrapper>
                <IgnoreButton onClick={onClickIgnore}>
                    {t("update.no")}
                </IgnoreButton>
                <UpdateButton onClick={onClickUpdate}>
                    {t("update.yes")}
                </UpdateButton>
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

const Message = styled.p`
    word-break: keep-all;
    user-select: none;
    -webkit-user-select: none;
`

const ButtonWrapper = styled.div`
    display: flex;
    gap: 0.5em;
`

const UpdateButton = styled(MildButton)`
    font-weight: 600;
    word-break: keep-all;
    padding: 0.35em 0.65em;

    background-color: ${(p) => p.theme.thirdBackgroundColor};

    border: 1px solid ${(p) => p.theme.textColor};
    border-radius: 8px;
`

const IgnoreButton = styled(UpdateButton)`
    color: ${(p) => p.theme.secondTextColor};
    border-color: ${(p) => p.theme.secondTextColor};
    background-color: transparent;
    font-weight: normal;
`
