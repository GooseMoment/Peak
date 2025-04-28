import { ReactNode, useState } from "react"

import styled from "styled-components"

import FeatherIcon from "feather-icons-react"
import { Sheet } from "react-modal-sheet"

interface BottomSheetProps {
    onClose: () => void
    initialSnap?: number
    title?: string | null
    icon?: ReactNode
    handleBack?: (() => void) | null
    children: ReactNode
}

const ModalBottomSheet = ({
    onClose,
    initialSnap = 0,
    title,
    icon,
    handleBack,
    children,
}: BottomSheetProps) => {
    const [isOpen, setIsOpen] = useState(true)

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleAnimationEnd = () => {
        onClose()
    }

    return (
        <StyledSheet
            isOpen={isOpen}
            onClose={closeModal}
            onCloseEnd={handleAnimationEnd}
            snapPoints={[600, 500, 200, 0]}
            initialSnap={initialSnap}>
            <Sheet.Container>
                <Sheet.Header>
                    <HeaderBox>
                        {handleBack ? (
                            <FeatherIcon
                                icon="chevron-left"
                                onClick={handleBack}
                            />
                        ) : icon ? (
                            icon
                        ) : (
                            <EmptyBox />
                        )}
                        {title}
                        <FeatherIcon icon="x" onClick={closeModal} />
                    </HeaderBox>
                </Sheet.Header>
                <StyledScroller draggableAt="both">{children}</StyledScroller>
            </Sheet.Container>
            <Sheet.Backdrop onTap={closeModal} />
        </StyledSheet>
    )
}

const StyledSheet = styled(Sheet)`
    z-index: 99 !important;

    .react-modal-sheet-container {
        border-top-left-radius: 30px !important;
        border-top-right-radius: 30px !important;
        background-color: ${(p) => p.theme.backgroundColor} !important;
    }

    .react-modal-sheet-header {
        box-shadow: none;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        background-color: ${(p) => p.theme.backgroundColor};
    }
`

const StyledScroller = styled(Sheet.Scroller)`
    overflow-y: auto;
    overflow-x: hidden;
`

const HeaderBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1em;
    font-weight: bold;
    color: ${(p) => p.theme.textColor};
    margin: 1.5em 1em 0.5em;

    & svg {
        top: 0;
    }
`

// Same as chevron-left icon size
const EmptyBox = styled.div`
    width: 17.6px;
    height: 17.6px;
`

export default ModalBottomSheet
