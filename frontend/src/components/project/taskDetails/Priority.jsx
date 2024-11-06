import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import critical from "@assets/project/priority/critical.svg"
import important from "@assets/project/priority/important.svg"
import normal from "@assets/project/priority/normal.svg"

import { useTranslation } from "react-i18next"

const Priority = ({ setFunc, onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.priority" })

    const changePriority = (priority) => {
        return async () => {
            setFunc({ priority })
            onClose()
        }
    }

    const items = [
        { id: 0, icon: <img src={normal} />, content: t("normal") },
        { id: 1, icon: <img src={important} />, content: t("important") },
        { id: 2, icon: <img src={critical} />, content: t("critical") },
    ]

    return items.map((item) => (
        <ItemBlock key={item.id}>
            {item.icon}
            <ItemText onClick={changePriority(item.id)}>
                {item.content}
            </ItemText>
        </ItemBlock>
    ))
}

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    ${ifMobile} {
        margin-left: 0.1em;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: ${(p) => p.theme.textColor};

    &:hover {
        font-weight: bolder;
        color: ${(p) => p.theme.goose};
        cursor: pointer;
    }
`

export default Priority
