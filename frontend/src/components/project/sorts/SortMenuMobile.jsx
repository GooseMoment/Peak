import styled from "styled-components"

import ModalBottomSheet, { Header } from "@components/common/ModalBottomSheet"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const SortMenuMobile = ({ title, items, onClose, ordering, setOrdering }) => {
    const { t } = useTranslation(null, { keyPrefix: "project.sort" })

    return (
        <ModalBottomSheet
            headerContent={
                <Header
                    title={t("title", { title: title })}
                    closeSheet={onClose}
                />
            }
            onClose={onClose}>
            <ContentBox>
                <CLine />
                {items.map((item) => (
                    <DisplayBox
                        key={item.display}
                        onClick={() => setOrdering(item.context)}
                        $isSelected={item.context === ordering}>
                        <FeatherIcon icon="check" />
                        {item.display}
                    </DisplayBox>
                ))}
            </ContentBox>
        </ModalBottomSheet>
    )
}

const ContentBox = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 1em;
    margin: 1em 2em;
`

const DisplayBox = styled.div`
    display: flex;
    justify-content: flex-start;
    font-weight: normal;
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
    margin-bottom: 1em;
    cursor: pointer;
    gap: 0.1em;

    & svg {
        aspect-ratio: 1;
        width: 16px;
        height: 16px;
        top: 0;
        stroke-width: 3px;
        color: ${(props) =>
            props.$isSelected ? props.theme.textColor : "transparent"};
    }
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.grey};
    width: 100%;
    margin-bottom: 1em;
`

export default SortMenuMobile
