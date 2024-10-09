import { useState } from 'react'

import styled from 'styled-components'
import FeatherIcon from 'feather-icons-react'

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'

const Header = ({ closeSheet }) => {
    return (
        <HeaderBox>
            <FeatherIcon icon="chevron-left" onClick={closeSheet}/>
            작업 생성
            <FeatherIcon icon="x" onClick={closeSheet}/>
        </HeaderBox>
    )
}

const ModalBottomSheet = ({ onClose, children }) => {
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
            header={<Header closeSheet={closeModal}/>}
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
    }

    [data-rsbs-header] {
        box-shadow: none;
    }
`

const HeaderBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1em;
    font-weight: bold;
    margin: 1em 0;

    & svg {
        top: 0;
    }
`

export default ModalBottomSheet