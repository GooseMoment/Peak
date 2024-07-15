import styled from "styled-components"
import { useState } from "react"

import Detail from "@components/project/common/Detail"
import Button from "@components/common/Button"
import notify from "@utils/notify"

const Memo = ({previousMemo, setFunc, closeComponent}) => {
    const [memo, setMemo] = useState(previousMemo)

    const changeMemo = () => {
        return async () => {
            setFunc({memo})
            closeComponent()
            notify.success("메모가 변경되었습니다.")
        }
    }

    const onChange = (e) => {
        const newMemo = e.target.value
        setMemo(newMemo)
    }

    return (
        <Detail title="메모 설정" onClose={closeComponent}>
            <FlexBox>
                <Editor
                    type='text'
                    onChange={onChange}
                    value={memo}
                    placeholder="메모를 입력해주세요."
                />
            </FlexBox>
            <FlexBox>
                <Button onClick={changeMemo(memo)}>변경하기</Button>
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
    color: ${p => p.theme.textColor};
    border: 1px solid ${p => p.theme.project.borderColor};
    border-radius: 15px;
    margin-top: 0.7em;
    padding: 0.8em;
    white-space: pre-wrap;
    
    &:focus {
        outline: none;
    }
`

export default Memo