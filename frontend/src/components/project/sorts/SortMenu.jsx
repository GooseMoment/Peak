import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { dropdown } from "@assets/keyframes"

const SortMenu = ({ title, items, selectedButtonPosition, ordering, setOrdering }) => {    
    const { t } = useTranslation(null, {keyPrefix: "project.sort"})
    
    return (
        <ContextMenuBox
            $top={selectedButtonPosition.top}
            $left={selectedButtonPosition.left}
        >
            <TitleBox>{t("title", {title: title})}</TitleBox>
            <CLine/>
            {items.map((item) => (
                <DisplayBox key={item.display} onClick={()=>setOrdering(item.context)} $isSelected={item.context === ordering}>
                    <EmptyBox><FeatherIcon icon="check"/></EmptyBox>
                    {item.display}
                </DisplayBox>
            ))}
        </ContextMenuBox>
    )
}

const ContextMenuBox = styled.div`
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 1em;
    width: 12em;
    height: auto;
    gap: 1em;
    overflow: hidden;

    top: ${props => props.$top + window.scrollY + 25}px;
    left: ${props => props.$left - 110}px;

    background-color: ${p => p.theme.backgroundColor};
    border: solid 2px ${p => p.theme.textColor};
    border-radius: 15px;

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
    cursor: pointer;

    & svg {
        aspect-ratio: 1;
        top: 0;
        color: ${props => props.$isSelected ? props.theme.primaryColors.success : 'transparent'};
    }
`

const EmptyBox = styled.div`
    width: 16px;
    height: 16px;
    margin-right: 0.5em;
`

const CLine = styled.div`
    border-top: thin solid ${p => p.theme.project.clineColor};
    width: 100%;
`

export default SortMenu