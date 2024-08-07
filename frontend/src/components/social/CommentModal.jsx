import { useState } from 'react'
import styled from 'styled-components'
import { Portal } from 'react-portal'

import CommentBox from '@components/social/CommentBox'

const CommentModal = ({ isOpen, onClose, position, parentComments}) => {
    if (!isOpen) return null

    return (
        <Portal>
            <Wrapper>
                <CommentModalOverlay onClick={onClose} />
                <Modal $posY={position.top} $posX={position.left}>
                    <CommentContainer>
                        {parentComments?(
                            Object.values(parentComments).map((comment) => (
                                <CommentBox comment={comment} />
                            ))
                        ) : (
                            "no comments"
                        )}
                    </CommentContainer>
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
    top: ${props => props.$posY}px;
    left: calc(${props => props.$posX}px - 28em); // 27 + 1(shadow)
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
`

const CommentContainer = styled.div`
    height: 20em;

    border: solid black;

    display: flex;
    flex-direction: column-reverse;
    justify-content: end;

    gap: 0.3em;
`

export default CommentModal;