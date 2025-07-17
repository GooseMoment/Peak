import { type KeyboardEvent, useCallback, useRef, useState } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import { type Remark, putRemark } from "@api/social.api"

import FeatherIcon from "feather-icons-react"

interface RemarkBoxProps {
    remark?: Remark
}

export const RemarkBox = ({ remark }: RemarkBoxProps) => {
    if (!remark) {
        return null
    }

    return (
        <Box>
            <Title>Remark of the day</Title>
            <Content>{remark.content}</Content>
        </Box>
    )
}

interface RemarkInputProps {
    remark?: Remark
    date: string
}

export const RemarkInput = ({ remark, date }: RemarkInputProps) => {
    const [isEditing, setEditing] = useState(false)
    const [content, setContent] = useState("")
    const hiddenContent = useRef<HTMLDivElement | null>(null)

    const client = useQueryClient()
    const mut = useMutation({
        mutationFn() {
            return putRemark(date, content)
        },
        onSuccess(data) {
            client.setQueryData(["remarks", data.user.username, date], data)
            client.invalidateQueries({
                queryKey: ["remarks", data.user.username, date],
            })
            setEditing(false)
        },
    })

    const handleClick = () => {
        if (!isEditing) {
            setContent(remark?.content || "")
            setEditing(true)
            return
        }

        submit()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.repeat || mut.isPending) {
            return
        }

        if (e.key === "Enter" && e.shiftKey) {
            return
        }

        if (e.key === "Enter") {
            e.preventDefault()
            submit()
        }
    }

    const submit = () => {
        if (content === remark?.content) {
            setEditing(false)
            return
        }

        mut.mutate()
    }

    const resizeTextarea = useCallback(
        (node: HTMLTextAreaElement | null) => {
            if (!node) {
                return
            }

            node.style.height = "auto"
            node.style.height = `${node.scrollHeight}px`
        },
        [content],
    )

    return (
        <InputWrapper>
            {isEditing ? (
                <Box $isFocus>
                    <Title>Edit a remark</Title>
                    <TextArea
                        ref={resizeTextarea}
                        disabled={mut.isPending}
                        defaultValue={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <Content ref={hiddenContent} hidden>
                        {content}
                    </Content>
                </Box>
            ) : (
                <Box>
                    <Title>Remark of the day</Title>
                    <Content>{remark?.content}</Content>
                </Box>
            )}
            <Button disabled={mut.isPending} onClick={handleClick}>
                {isEditing ? (
                    <FeatherIcon icon="save" />
                ) : (
                    <FeatherIcon icon="edit-3" />
                )}
            </Button>
        </InputWrapper>
    )
}

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    position: relative;
`

const Box = styled.article<{ $isFocus?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.75em;

    position: relative;
    box-sizing: border-box;

    padding: 1.25em;

    border-radius: 10px;

    border: 2px
        ${(p) =>
            p.$isFocus ? p.theme.primaryColors.info : p.theme.backgroundColor}
        solid;
    transition: border 0.5s var(--cubic);

    background-color: ${(p) => p.theme.backgroundColor};
    box-shadow: ${(p) => p.theme.notifications.boxShadowColor} 0px 8px 24px;
`

const TextArea = styled.textarea`
    line-height: 1.35;

    border: none;
    resize: none;
    padding: 0;
    margin-block: 0;
`

const Title = styled.h3`
    font-size: 0.85em;
    font-weight: 600;
`

const Content = styled.p`
    line-height: 1.35;
    white-space: pre-wrap;
    word-break: break-word;
`

const Button = styled(MildButton)`
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0.75em;
    right: 0.75em;

    width: 2em;
    height: 2em;
    border-radius: 50%;

    background-color: ${(p) => p.theme.thirdBackgroundColor};

    & svg {
        stroke-width: 2.5px;
        margin-right: 0;
        top: 0;
    }
`
