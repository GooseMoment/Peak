import styled from "styled-components"

import Detail from "@components/project/common/Detail"
import { useTranslation } from "react-i18next"

import goal from "@assets/project/type/goal.svg"
import regular from "@assets/project/type/regular.svg"

const Type = ({setType, closeComponent}) => {
    const { t } = useTranslation(null, {keyPrefix: "project.create.type"})

    const changeType = (type) => {
        return () => {
            setType(type)
            closeComponent()
        }
    }

    const items = [
        {icon: <img src={regular}/>, type: "regular"},
        {icon: <img src={goal}/>, type: "goal"}
    ]

    return (
        <Detail title={t("title")} onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.type}>
                    {item.icon}
                    <ItemText onClick={changeType(item.type)}>{t(item.type)}</ItemText>
                </ItemBlock>
            ))}
        </Detail>
    )
}

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        width: 1.2em;
        height: 1.2em;
        stroke: none;
        top: 0;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: ${p => p.theme.textColor};

    &:hover {
        font-weight: bolder;
        color: ${p => p.theme.goose};
        cursor: pointer;
    }
`

export default Type