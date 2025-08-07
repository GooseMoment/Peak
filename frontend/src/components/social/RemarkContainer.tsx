import { type KeyboardEvent, useCallback, useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import MildButton from "@components/common/MildButton"

import { getCurrentUsername } from "@api/client"
import {
    type Remark,
    deleteRemark,
    getRemark,
    putRemark,
} from "@api/social.api"
import { type User } from "@api/users.api"

import FeatherIcon from "feather-icons-react"
import { type DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface RemarkContainerProps {
    username: User["username"]
    date: DateTime
}

const RemarkContainer = ({ username, date }: RemarkContainerProps) => {
    const { data, isPending, isError } = useQuery({
        queryKey: ["remarks", username, date.toISODate()],
        queryFn() {
            return getRemark(username, date.toISODate()!)
        },
    })

    if (isPending) {
        return <RemarkBox loading />
    }

    if (isError) {
        return null
    }

    if (username === getCurrentUsername()) {
        return <RemarkInput remark={data} date={date} />
    }

    return <RemarkBox remark={data} />
}

export default RemarkContainer

interface RemarkBoxProps {
    remark?: Remark | null
    loading?: boolean
}

export const RemarkBox = ({ remark, loading = false }: RemarkBoxProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "social.remarks" })
    if (loading) {
        return (
            <Box>
                <Title $loading />
                <Content $loading />
            </Box>
        )
    }

    if (!remark) {
        return null
    }

    return (
        <Box>
            <Title>{t("title")}</Title>
            <Content>{remark.content}</Content>
        </Box>
    )
}

interface RemarkInputProps {
    // RemarkInput should be called after fetching is finished regradless of the existence of the remark
    remark: Remark | null
    date: DateTime
}

export const RemarkInput = ({ remark, date }: RemarkInputProps) => {
    const [isEditing, setEditing] = useState(false) // whether on the edit mode or not
    const [content, setContent] = useState(remark?.content || "") // textarea value
    const textareaRef = useRef<HTMLTextAreaElement | null>(null) // contains the textarea element

    const { t } = useTranslation("translation")

    // resizes the textarea automatically whenever the value changes
    const resizeTextarea = useCallback(
        (node: HTMLTextAreaElement | null) => {
            if (!node) {
                return
            }

            textareaRef.current = node

            node.style.height = "auto"
            node.style.height = `${node.scrollHeight + 10}px`
        },
        [content],
    )

    // focuses on the textarea and puts the cursor on the end of the content
    // when the user enters the edit mode
    useEffect(() => {
        if (!isEditing) {
            return
        }

        if (!textareaRef.current) {
            return
        }

        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(
            textareaRef.current.value.length,
            textareaRef.current.value.length,
        )
    }, [isEditing])

    useEffect(() => {
        setContent(remark?.content || "")

        return () => setEditing(false)
    }, [date])

    const client = useQueryClient()
    const mut = useMutation<null | Remark>({
        mutationFn() {
            if (content === "") {
                return deleteRemark(date.toISODate()!)
            }

            return putRemark(date.toISODate()!, content)
        },
        onSuccess(data) {
            setEditing(false)
            client.invalidateQueries({
                queryKey: ["remarks", getCurrentUsername(), date.toISODate()],
            })
            client.setQueryData(
                ["remarks", getCurrentUsername(), date.toISODate()],
                data,
            )
        },
        onError() {
            toast.error(t("common.error_perform"))
        },
    })

    const handleClick = () => {
        if (isEditing) {
            submit()
            return
        }

        setContent(remark?.content || "")
        setEditing(true)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.repeat) {
            return
        }

        // skip if Shift+Enter
        if (e.key === "Enter" && e.shiftKey) {
            return
        }

        // eat off Enter and submit
        if (e.key === "Enter") {
            e.preventDefault()
            submit()
        }
    }

    const submit = () => {
        if (mut.isPending) {
            return
        }

        // if the content was not changed
        if (
            content === remark?.content ||
            (content === "" && remark === null)
        ) {
            // do not send a requst to a server
            setEditing(false)
            return
        }

        mut.mutate()
    }

    return (
        <InputWrapper>
            <Box $isFocused={isEditing}>
                <Title>
                    {!remark
                        ? t("social.remarks.title_create")
                        : isEditing
                          ? t("social.remarks.title_edit")
                          : t("social.remarks.title")}
                </Title>
                <TextArea
                    ref={resizeTextarea}
                    disabled={mut.isPending || !isEditing}
                    placeholder={
                        isEditing
                            ? t("social.remarks.placeholder_edit")
                            : t("social.remarks.placeholder")
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </Box>
            <Button disabled={mut.isPending} onClick={handleClick}>
                {mut.isPending ? (
                    <FeatherIcon icon="loader" />
                ) : isEditing ? (
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

const Box = styled.article<{ $isFocused?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.75em;

    position: relative;
    box-sizing: border-box;

    padding: 1.25em;

    border-radius: 10px;

    border: 2px
        ${(p) =>
            p.$isFocused ? p.theme.primaryColors.info : p.theme.backgroundColor}
        solid;
    transition: border 0.5s var(--cubic);

    background-color: ${(p) => p.theme.backgroundColor};
    box-shadow: ${(p) => p.theme.notifications.boxShadowColor} 0px 8px 24px;
`

const TextArea = styled.textarea`
    font-size: 1em;
    line-height: 1.35;

    border: none;
    resize: none;
    padding: 0;
    margin-block: 0;
`

const Title = styled.h3<{ $loading?: boolean }>`
    font-size: 0.85em;
    font-weight: 600;

    ${(p) =>
        p.$loading &&
        css`
            height: 0.85em;
            width: 7em;
            background-color: ${(p) => p.theme.thirdBackgroundColor};
        `}
`

const Content = styled.p<{ $loading?: boolean }>`
    line-height: 1.35;
    white-space: pre-wrap;
    word-break: break-word;

    ${(p) =>
        p.$loading &&
        css`
            height: 3em;
            width: 100%;
            background-color: ${(p) => p.theme.thirdBackgroundColor};
            border-radius: 5px;
        `}
`

const Button = styled(MildButton)`
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0.75em;
    right: 1em;

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
