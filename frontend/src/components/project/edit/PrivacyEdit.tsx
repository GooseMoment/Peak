import styled from "styled-components"

import Detail from "@components/project/common/Detail"

import { type Privacy } from "@api/common"
import { type DrawerCreate } from "@api/drawers.api"
import { type ProjectCreateInput } from "@api/projects.api"

import { useModalContext } from "@utils/useModal"

import defaultsvg from "@assets/project/privacy/default.svg"
import privatesvg from "@assets/project/privacy/private.svg"
import protectedsvg from "@assets/project/privacy/protected.svg"
import publicsvg from "@assets/project/privacy/public.svg"

import { useTranslation } from "react-i18next"

const PrivacyEdit = ({
    setPrivacy,
    isDrawer,
}: {
    setPrivacy: (
        diff: Partial<ProjectCreateInput> | Partial<DrawerCreate>,
    ) => void
    isDrawer?: boolean
}) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit.privacy",
    })

    const modal = useModalContext()

    const changePrivacy = (privacy: Privacy | "default") => {
        return () => {
            const valueToSend =
                privacy === "default" ? null : (privacy as Privacy)
            setPrivacy({ privacy: valueToSend })
            modal?.closeModal()
        }
    }

    const items = [
        ...(isDrawer
            ? [
                  {
                      icon: <img src={defaultsvg} />,
                      privacy: "default" as const,
                  },
              ]
            : []),
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
