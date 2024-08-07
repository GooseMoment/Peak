import styled from "styled-components"

import Detail from "@components/project/common/Detail"

import privatesvg from "@assets/project/privacy/private.svg"
import protectedsvg from "@assets/project/privacy/protected.svg"
import publicsvg from "@assets/project/privacy/public.svg"

import { useTranslation } from "react-i18next"

const Privacy = ({ setPrivacy, closeComponent }) => {
    const { t } = useTranslation(null, { keyPrefix: "project.create.privacy" })

    const changePrivacy = (privacy) => {
        return () => {
            setPrivacy(privacy)
            closeComponent()
        }
    }

    const items = [
        { icon: <img src={publicsvg} />, privacy: "public" },
        { icon: <img src={protectedsvg} />, privacy: "protected" },
        { icon: <img src={privatesvg} />, privacy: "private" },
    ]

    return (
        <Detail title={t("title")} onClose={closeComponent}>
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

export default Privacy
