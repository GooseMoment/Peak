import { Section, SectionTitle } from "./Section"
import { skeletonBreathingCSS } from "@assets/skeleton"

import styled, { css } from "styled-components"
import { useTranslation } from "react-i18next"

const Bio = ({bio, isMine, isPending}) => {
    const { t } = useTranslation(null, {keyPrefix: "users"})

    return <Section>
        <SectionTitle>{t("bio")}</SectionTitle>
        <BioBox $empty={!bio} $skeleton={isPending}>
            {
                isPending && " " ||
                bio ||
                (isMine ? t("bio_empty_mine") : t("bio_empty"))
            }
        </BioBox>
    </Section>
}

const BioBox = styled.div`
    background-color: ${p => p.theme.thirdBackgroundColor};
    border-radius: 16px;

    line-height: 1.5em;

    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;

    white-space: pre-wrap;

    ${p => p.$empty && css`
        font-style: italic;
        color: ${p => p.theme.grey};
    `}

    ${p => p.$skeleton && css`
        height: 5em;
        ${skeletonBreathingCSS}
    `}
`

export default Bio
