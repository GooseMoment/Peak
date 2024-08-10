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

import queryClient from "@queries/queryClient"

import { Portal } from "react-portal"
import { toast } from "react-toastify"

const CommentModal = ({ isOpen, onClose, position, parentType, parent }) => {
    const [commentValue, setCommentValue] = useState("")

    const {
        data: parentComments,
        isFetching,
    } = useQuery({
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
        <Portal>
            <Wrapper>
                <CommentModalOverlay onClick={onClose} />
                <Modal $posY={position.top} $posX={position.left}>
                    <CommentContainer>
                        {parentComments
                            ? Object.values(parentComments).map((comment) => (
                                  <CommentBox
                                      key={comment.id}
                                      comment={comment}
                                  />
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
        </Portal>
    )
}

const Wrapper = styled.div`
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
    background: white;
    padding: 1em;
    border-radius: 1em;
    border: 0.2em solid rgba(123, 123, 123, 0.1);
    box-shadow: 0.2em 0.2em 0.4em rgba(0, 0, 0, 0.1);
    width: 25em;
    height: 24em;
    overflow-y: auto;
    z-index: 10;
    pointer-events: auto;

    display: flex;
    flex-direction: column;
    justify-content: end;
`

const CommentContainer = styled.div`
    height: 20em;

    display: flex;
    flex-direction: column-reverse;
    justify-content: end;

    overflow-y: scroll;
    gap: 0.3em;
`

const CommentInput = styled.input`
    height: 3.5em;
    width: 23em;

    padding: 0.5em;
    font-size: 1em;

    border-radius: 0.5em;

    border: solid black;
`

export default CommentModal
