import { useEffect, useState } from "react"

import styled, { useTheme } from "styled-components"

import SimpleProfile from "@components/social/common/SimpleProfile"

import { getCurrentUsername } from "@api/client"

import { useTranslation } from "react-i18next"

const Quote = ({ user, quote, saveQuote }) => {
    const { t } = useTranslation("", { keyPrefix: "social.quote" })

    const [inputState, setInputState] = useState(false)
    const [content, setContent] = useState(quote.content)

    useEffect(() => {
        setContent(quote.content)
        setInputState(false)
    }, [quote])

    const theme = useTheme()

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
            <SimpleProfile user={user} showUsername/>

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
                    <Content $color={theme.textColor}>
                        {'"' + quote.content + '"'}
                    </Content>
                ) : quote.user.username === me ? (
                    <Content $color={theme.secondTextColor} $fontstyle="italic">
                        {t("empty_self_quote")}
                    </Content>
                ) : (
                    <Content $color={theme.secondTextColor} $fontstyle="italic">
                        {t("empty_others_quote")}
                        {/* 상대방의 username(또는 displayname) 보여주면 좋을 듯 */}
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
    background-color: ${(p) => p.theme.secondBackgroundColor};
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

    text-align: center;
    font-size: 1em;
    white-space: normal;

    color: ${(props) => props.theme.textColor};
`

export default Quote
