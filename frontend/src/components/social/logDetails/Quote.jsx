import { useEffect, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import SimpleProfile from "@components/social/common/SimpleProfile"

import { getMe } from "@api/users.api"
import { getCurrentUsername } from "@/api/client"

const Quote = ({ user, quote, saveQuote }) => {
    const [inputState, setInputState] = useState(false)
    const [content, setContent] = useState(quote.content)

    useEffect(() => {
        setContent(quote.content)
        setInputState(false)
    }, [quote])

    const me = getCurrentUsername()

    const handleInputState = () => {
        if (quote.user.username === me) setInputState(true)
        else setInputState(false)
    }

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            setInputState(false)
            saveQuote(content)
        }
    }

    // TODO: 바깥 클릭 시 임시 저장?
    const handleBlur = () => {
        setInputState(false)
        saveQuote(content)
    }

    return (
        <Box>
            <SimpleProfile user={user} />

            <Wrapper onClick={handleInputState}>
                {inputState ? (
                    <QuoteInput
                        type="text"
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                    />
                ) : quote.content ? (
                    <Content>{'"' + quote.content + '"'}</Content>
                ) : quote.user.username === me ? (
                    <Content $color="#A4A4A4" $fontstyle="italic">
                        {"Write your daily comments"}
                    </Content>
                ) : (
                    <Content $color="#A4A4A4" $fontstyle="italic">
                        {"No daily comments yet"}
                    </Content>
                )}
            </Wrapper>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    gap: 0.5em;
`

const Wrapper = styled.div`
    width: 72%;
    border-radius: 1em;
    background-color: #e6e6e6;
    padding: 1em;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
`

const Content = styled.div`
    white-space: normal;
    color: ${(props) => props.$color};
    font-style: ${(props) => props.$fontstyle};
`

const QuoteInput = styled.input`
    height: 100%;
    width: 100%;
    background-color: inherit;
    text-align: center;
    font-size: 1em;
    white-space: normal;
`

export default Quote
