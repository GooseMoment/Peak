import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import ModalPortal from "@components/common/ModalPortal"
import Button from "@components/sign/Button"

const MiddleFrame = ({items, submit, isComponentOpen, setIsComponentOpen}) => {
    const [content, setContent] = useState()
    
    const handleClickContent = (e) => {
        setIsComponentOpen(true)
        const name = e.target.id
        setContent(name)
    }
    
    return (
        <>
            {items.map(item => (
            <>
            <ContentsBox key={item.icon}>
                {(item.icon === "circle") ? 
                <FeatherIcon icon={item.icon} fill={'#'+item.color} stroke="none"/> :
                <FeatherIcon icon={item.icon} />}
                <VLine/>
                <ContentText id ={item.icon} onClick={handleClickContent}>
                    {item.display ? item.display : "없음"}
                </ContentText>
            </ContentsBox>
            {(content === item.icon && isComponentOpen) ? 
                <ModalPortal closeModal={() => setIsComponentOpen(false)} additional>
                    {item.component}
                </ModalPortal> : null}
            </>
            ))}
            <AddButton onClick={submit}>추가하기</AddButton>
        </>
    )
}

const ContentsBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0em 3.5em;

    & svg {
        width: 1.3em;
        height: 1.3em;
        margin-top: 1.3em;
        top: 0;
    }
`

const VLine = styled.div`
    border-left: thin solid #D9D9D9;
    height: 1em;
    margin-top: 1.3em;
    margin-left: 1em;
    transform: scale(1, 2);
`

const ContentText = styled.div`
    font-style: normal;
    font-size: 1.2em;
    color: #000000;
    margin-top: 1.1em;
    margin-left: 1.3em;
    text-decoration: none;

    &:hover {
    cursor: pointer;
    }
`

const AddButton = styled(Button)`
    float: right;
    margin: 1em;
    margin-right: 2.5em;
    margin-bottom: 2em;
`

export default MiddleFrame