import { useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import CommentBox from "@components/social/interaction/comment/CommentBox"

import {
    deleteComment,
    getComment,
    patchComment,
    postComment,
} from "@api/social.api"

import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { toast } from "react-toastify"

const CommentModal = ({ isOpen, onClose, position, parentType, parent }) => {
    const [commentValue, setCommentValue] = useState("")

    const { data: parentComments, isFetching } = useQuery({
        queryKey: ["comment", parentType, parent.id],
        queryFn: () => getComment(parentType, parent.id),
    })

    const parentCommentsMutation = useMutation({
        mutationFn: ({ action, commentID, comment }) => {
            if (action === "post") {
                return postComment(parentType, parent.id, comment)
            } else if (action === "patch") {
                return patchComment(parentType, parent.id, commentID, comment)
            } else if (action === "delete") {
                return deleteComment(parentType, parent.id, commentID)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comment", parentType, parent.id],
            })
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    if (!isOpen) return null

    const handleChange = (e) => {
        setCommentValue(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            parentCommentsMutation.mutate({
                action: "post",
                comment: commentValue,
            })
            setCommentValue("")
        }
    }

    return (
        <Wrapper>
            <CommentModalOverlay onClick={onClose} />
            <Modal $posY={position.top} $posX={position.left}>
                <CommentContainer>
                    {parentComments
                        ? Object.values(parentComments).map((comment) => (
                              <CommentBox key={comment.id} comment={comment} />
                          ))
                        : // TODO: design no comments
                          // TODO: 로딩중
                          "no comments"}
                </CommentContainer>
                <CommentInput
                    type="text"
                    value={commentValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </Modal>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`

const CommentModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
`

const Modal = styled.div`
    position: absolute;
    top: ${(props) => props.$posY}px;
    left: calc(${(props) => props.$posX}px - 28em); // 27 + 1(shadow)
    width: 25em;
    height: 24em;

    box-shadow: 0.2em 0.3em 0.5em
        ${(props) => props.theme.social.modalShadowColor};
    border: 0.1em solid ${(props) => props.theme.social.modalShadowColor};
    border-radius: 1em;
    background: ${(props) => props.theme.backgroundColor};
    padding: 1em;

    overflow-y: auto;
    pointer-events: auto;

    display: flex;
    flex-direction: column;
    justify-content: end;

    ${ifMobile} {
        position: absolute;
        left: 0;
        width: 90vw;
    }
`

const CommentContainer = styled.div`
    height: 20em;

    display: flex;
    flex-direction: column-reverse;
    justify-content: end;

    /* TODO: Need to check availability */
    overflow-y: scroll;
    scrollbar-width: none;
    &:hover {
        scrollbar-width: thin;
    }
    &::-webkit-scrollbar {
        width: 0;
    }
    &:hover::-webkit-scrollbar {
        width: auto;
    }
    gap: 0.3em;
`

const CommentInput = styled.input`
    height: 3.5em;
    flex-grow: 1;

    padding: 0.5em;
    border-radius: 0.5em;
    border: solid 1.4px ${(props) => props.theme.social.borderColor};

    font-size: 1em;
    color: ${(props) => props.theme.textColor};
`

export default CommentModal
