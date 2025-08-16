import { ChangeEvent, useState } from "react"

import styled from "styled-components"

import Button from "@components/common/Button"

import { type MinimalTask } from "@api/tasks.api"

import { ifMobile } from "@utils/useScreenType"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskDetailMemo = ({
    previousMemo,
    setFunc,
    onClose,
}: {
    previousMemo: string | undefined
    setFunc: (diff: Partial<MinimalTask>) => void
    onClose: () => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.memo" })

    const [memo, setMemo] = useState(previousMemo)

    const changeMemo = () => {
        return async () => {
            setFunc({ memo })
            toast.success(t("memo_edit_success"))
            onClose()
        }
    }

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newMemo = e.target.value
        setMemo(newMemo)
    }

    return (
        <>
            <FlexBox>
                <Editor
                    onChange={onChange}
                    value={memo || ""}
                    placeholder={t("memo_placeholder")}
                />
            </FlexBox>
            <FlexBox>
                <Button onClick={changeMemo}>{t("button_change")}</Button>
            </FlexBox>
        </>
    )
}

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 0.5em;

    ${ifMobile} {
        width: 100%;
    }
`

const Editor = styled.textarea`
    width: 70%;
    height: 17em;
    font-weight: normal;
    resize: none;
    font-size: 0.95em;
    color: ${(p) => p.theme.textColor};
    border: 1px solid ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    margin-top: 0.7em;
    padding: 0.8em;
    white-space: pre-wrap;

    &:focus {
        outline: none;
    }

    ${ifMobile} {
        width: 90%;
    }
`

export default TaskDetailMemo
