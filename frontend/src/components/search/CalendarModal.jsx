import { useEffect, useState } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"

import { ifMobile } from "@utils/useScreenType"

const CalendarModal = ({
    isOpen,
    handleClose,
    position,
    filter,
    updateFilterValue,
}) => {
    const initialDate = new Date()
    initialDate.setHours(0, 0, 0, 0)

    const [startDate, setStartDate] = useState(
        filter.value ? filter.value.startDate : initialDate.toISOString(),
    )
    const [endDate, setEndDate] = useState(
        filter.value ? filter.value.endDate : initialDate.toISOString(),
    )

    useEffect(() => {
        updateFilterValue({
            startDate: startDate,
            endDate: endDate,
        })
    }, [startDate, endDate, updateFilterValue])

    if (!isOpen) return null

    return (
        <Wrapper>
            <CalendarModalOverlay onClick={handleClose} />
            <Modal $posY={position.top} $posX={position.left}>
                <CommonCalendar
                    isRangeSelectMode={true}
                    selectedStartDate={startDate}
                    setSelectedStartDate={setStartDate}
                    selectedEndDate={endDate}
                    setSelectedEndDate={setEndDate}
                    isModal={true}
                    handleClose={handleClose}
                />
            </Modal>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`

const CalendarModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
`

const Modal = styled.div`
    position: absolute;
    top: calc(${(props) => props.$posY}px + 0.5em);
    left: ${(props) => props.$posX}px;
    width: 25em;

    border: 0.1em solid ${(props) => props.theme.social.modalShadowColor};
    border-radius: 1em;
    background: ${(props) => props.theme.backgroundColor};
    padding: 1em;

    font-size: 0.8em;
    overflow-y: auto;
    pointer-events: auto;

    display: flex;
    flex-direction: column;
    justify-content: center;

    ${ifMobile} {
        left: auto;
    }
`

export default CalendarModal
