import FeatherIcon from "feather-icons-react"
import styled, { keyframes } from "styled-components"

const SortMenu = ({ items, selectedButtonPosition, ordering, setOrdering }) => {    
    const handleToggleSortMenu = (context) => {
        return async () => {
            setOrdering(context)
        }
    }

    return (
        <ContextMenuBox
            $top={selectedButtonPosition.top}
            $left={selectedButtonPosition.left}
        >
            <TitleBox>정렬 기준</TitleBox>
            <CLine/>
            {items.map((item) => (
                <DisplayBox key={item.display} onClick={handleToggleSortMenu(item.context)} $isSelected={item.context === ordering}>
                    <FeatherIcon icon="check"/>
                    {item.display}
                </DisplayBox>
            ))}
        </ContextMenuBox>
    )
}

const dropdown = keyframes`
    0% {
        opacity: 60%;
        transform: translateY(-5px);
    }
    100% {
        opacity: 100%;
        transform: translateY(0);
    }
`

const ContextMenuBox = styled.div`
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 1em;
    width: 10em;
    height: auto;
    gap: 1em;
    overflow: hidden;

    top: ${props => props.$top + window.scrollY + 25}px;
    left: ${props => props.$left - 95}px;

    background-color: ${p => p.theme.backgroundColor};
    border: solid 2px ${p => p.theme.textColor};
    border-radius: 15px;
    cursor: pointer;

    animation: ${dropdown} 0.4s ease;
`

const TitleBox = styled.div`
    font-size: 1em;
    font-weight: 480;
    color: ${p => p.theme.textColor};
`

const DisplayBox = styled.div`
    display: flex;
    justify-content: flex-start;
    font-weight: normal;
    font-size: 1em;
    color: ${p => p.theme.textColor};
    margin-bottom: 0.3em;

    & svg {
        top: 0;
        color: ${props => props.$isSelected ? props.theme.primaryColors.success : 'transparent'};
    }
`

const CLine = styled.div`
    border-top: thin solid ${p => p.theme.project.clineColor};
    width: 100%;
`

export default SortMenu