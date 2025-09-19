import styled from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Detail from "@components/project/common/Detail"

import { type Project, ProjectType } from "@api/projects.api"

import goal from "@assets/project/type/goal.svg"
import regular from "@assets/project/type/regular.svg"

import { useTranslation } from "react-i18next"

const ProjectTypeEdit = ({
    setType,
}: {
    setType: (diff: Partial<Project>) => void
}) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit.type",
    })

    const { closeModal } = useModalWindowCloseContext()

    const changeType = (type: ProjectType) => {
        return () => {
            setType({ type })
            closeModal()
        }
    }

    const items = [
        { icon: <img src={regular} />, type: "regular" as const },
        { icon: <img src={goal} />, type: "goal" as const },
    ]

    return (
        <Detail title={t("title")} onClose={closeModal}>
            {items.map((item) => (
                <ItemBlock key={item.type}>
                    {item.icon}
                    <ItemText onClick={changeType(item.type)}>
                        {t(item.type)}
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
    color: ${(p) => p.theme.textColor};

    &:hover {
        font-weight: bolder;
        color: ${(p) => p.theme.goose};
        cursor: pointer;
    }
`

export default ProjectTypeEdit
