import styled, { css } from "styled-components"

import { Section, SectionTitle } from "./Section"

import { type User } from "@api/users.api"

import { skeletonBreathingCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

interface BioProp {
    bio?: User["bio"]
    isMine?: boolean
    isLoading?: boolean
}

const Bio = ({ bio, isMine = false, isLoading = false }: BioProp) => {
    const { t } = useTranslation("translation", { keyPrefix: "users" })

    return (
        <Section>
            <SectionTitle>{t("bio")}</SectionTitle>
            <BioBox $empty={!bio} $loading={isLoading}>
                {(isLoading && " ") ||
                    bio ||
                    (isMine ? t("bio_empty_mine") : t("bio_empty"))}
            </BioBox>
        </Section>
    )
}

const BioBox = styled.div<{ $empty?: boolean; $loading?: boolean }>`
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    border-radius: 16px;

    line-height: 1.5em;

    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;

    white-space: pre-wrap;

    ${(p) =>
        p.$empty &&
        css`
            font-style: italic;
            color: ${(p) => p.theme.grey};
        `}

    ${(p) =>
        p.$loading &&
        css`
            height: 5em;
            ${skeletonBreathingCSS}
        `}
`

export default Bio
