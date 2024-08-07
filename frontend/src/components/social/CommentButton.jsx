import { useState, useRef } from "react"
import { useMutation, useQuery } from '@tanstack/react-query'
import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { toast } from 'react-toastify'

import MildButton from "@components/common/MildButton"
import CommentModal from "@components/social/CommentModal"

import queryClient from '@queries/queryClient'
import { deleteComment, getComment, patchComment, postComment } from '@api/social.api'

const CommentButton = ({parentType, parent}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPosition, setModalPosition] = useState({top: 0, left: 0})
    const buttonRef = useRef(null)

    // TODO: comment 있으면 이모지 다른 모양으로?
    // TODO: EmojiModal에서 시행
    const { data: parentComments, isError: parentCommentError, isFetching } = useQuery({
        queryKey: ["comment", parentType, parent.id],
        queryFn: () => getComment(parentType, parent.id),
    })

    const parentCommentsMutation = useMutation({
        mutationFn: ({action, commentID, comment}) => {
            if(action === 'post') {
                return postComment(parentType, parent.id, comment)
            } else if(action === 'patch') {
                return patchComment(parentType, parent.id, commentID, comment)
            } else if(action === 'delete') {
                return deleteComment(parentType, parent.id, commentID)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comment', parentType, parent.id]})
        },
        onError: (e) => {
            toast.error(e)
        }
    })


    const handleOpenModal = () => {
        console.log(isModalOpen)
        if(!isModalOpen) {
            if(buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setModalPosition({
                    top: rect.top,
                    left: rect.left,
                });
            }
        }
        setIsModalOpen(prev => !prev)
    }

    return <>
        <ButtonBox onClick={handleOpenModal} ref={buttonRef}>
            <FeatherIcon icon={'message-square'}/>
        </ButtonBox>
        <CommentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(prev => !prev)}
            position={modalPosition}
            parentComments={parentComments}
        /> 
    </>
}

const ButtonBox = styled(MildButton)`
    height: 2em;
    width: 1.5em;

    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
        top: unset;
        margin-right: unset;
    }
`

export default CommentButton