import { useState } from "react"

import styled from "styled-components"

import Button from "@components/common/Button"
import Detail from "@components/project/common/Detail"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"

const Memo = ({ previousMemo, setFunc }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.memo" })

    const [memo, setMemo] = useState(previousMemo)

    const { closeModal } = useModalWindowCloseContext()

    const changeMemo = () => {
        return async () => {
            setFunc({ memo })
            closeModal()
            toast.success(t("memo_edit_success"))
        }
    }

    const onChange = (e) => {
        const newMemo = e.target.value
        setMemo(newMemo)
    }

    return (
        <Detail title={t("title")} onClose={closeModal}>
            <FlexBox>
                <Editor
                    type="text"
                    onChange={onChange}
                    value={memo || ""}
                    placeholder={t("memo_placeholder")}
                />
            </FlexBox>
            <FlexBox>
                <Button onClick={changeMemo(memo)}>{t("button_change")}</Button>
            </FlexBox>
        </Detail>
    )
}

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 0.5em;
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
`

export default Memo
