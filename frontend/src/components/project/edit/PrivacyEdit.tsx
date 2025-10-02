import styled from "styled-components"

import Detail from "@components/project/common/Detail"

import { type Privacy } from "@api/common"
import { type Drawer } from "@api/drawers.api"
import { type Project } from "@api/projects.api"

import { useModalContext } from "@utils/useModal"

import privatesvg from "@assets/project/privacy/private.svg"
import protectedsvg from "@assets/project/privacy/protected.svg"
import publicsvg from "@assets/project/privacy/public.svg"

import { useTranslation } from "react-i18next"

const PrivacyEdit = ({
    setPrivacy,
}: {
    setPrivacy: (diff: Partial<Project> | Partial<Drawer>) => void
}) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit.privacy",
    })

    const modal = useModalContext()

    const changePrivacy = (privacy: Privacy) => {
        return () => {
            setPrivacy({ privacy })
            modal?.closeModal()
        }
    }

    const items = [
        { icon: <img src={publicsvg} />, privacy: "public" as const },
        { icon: <img src={protectedsvg} />, privacy: "protected" as const },
        { icon: <img src={privatesvg} />, privacy: "private" as const },
    ]

    return (
        <Detail title={t("title")} onClose={() => modal?.closeModal()}>
            {items.map((item) => (
                <ItemBlock key={item.privacy}>
                    {item.icon}
                    <ItemText onClick={changePrivacy(item.privacy)}>
                        {t(item.privacy)}
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

export default PrivacyEdit
