import styled from "styled-components"
import { useTranslation } from "react-i18next"

import Detail from "@components/project/common/Detail"

import normal from "@assets/project/priority/normal.svg"
import important from "@assets/project/priority/important.svg"
import critical from "@assets/project/priority/critical.svg"

const Priority = ({ setFunc, closeComponent }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.priority" })

    const changePriority = (priority) => {
        return async () => {
            setFunc({ priority })
            closeComponent()
        }
    }

    const items = [
        { id: 0, icon: <img src={normal} />, content: t("normal") },
        { id: 1, icon: <img src={important} />, content: t("important") },
        { id: 2, icon: <img src={critical} />, content: t("critical") },
    ]

    return (
        <Detail title={t("title")} onClose={closeComponent}>
            {items.map((item) => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changePriority(item.id)}>
                        {item.content}
                    </ItemText>
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
