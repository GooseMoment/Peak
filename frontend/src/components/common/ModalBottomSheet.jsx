import { useState } from 'react'

import styled from 'styled-components'
import FeatherIcon from 'feather-icons-react'

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'

export const Header = ({ title=null, handleBack, closeSheet }) => {
    return (
        <HeaderBox>
            {handleBack ? <FeatherIcon icon="chevron-left" onClick={handleBack}/> : <EmptyBox/>}
            {title}
            {closeSheet && <FeatherIcon icon="x" onClick={closeSheet}/>}
        </HeaderBox>
    )
}

const ModalBottomSheet = ({ headerContent=null, onClose, children }) => {
    const [closing, setClosing] = useState(false)

    const closeModal = () => {
        setClosing(false)
        onClose()
    }

    return (
        <StyledBottomSheet
            open={!closing}
            onDismiss={closeModal}
            snapPoints={({ maxHeight }) => [maxHeight * 0.8, maxHeight * 0.9]}
            header={headerContent}
        >
            {children}
        </StyledBottomSheet>
    )
}

const StyledBottomSheet = styled(BottomSheet)`
    [data-rsbs-overlay] {
        z-index: 98;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        background-color: ${p=>p.theme.backgroundColor};
    }

    [data-rsbs-header] {
        box-shadow: none;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        background-color: ${p=>p.theme.backgroundColor};
    }

    [data-rsbs-scroll] {
        background-color: ${p=>p.theme.backgroundColor};
    }
`

const HeaderBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1em;
    font-weight: bold;
    color: ${p=>p.theme.textColor};
    margin-top: 1em;

    & svg {
        top: 0;
    }
`

const EmptyBox = styled.div`
    width: 17.6px;
    height: 17.6px;
`

export default ModalBottomSheet