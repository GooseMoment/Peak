import Section, { Name, Value } from "@components/settings/Section"
import PageTitle from "@components/common/PageTitle"

import generatedGitInfo from '@/generatedGitInfo.json'

import styled from "styled-components"

import { useTranslation } from "react-i18next"

const Info = () => {
    const { t } = useTranslation(null, {keyPrefix: "settings.info"})

    return <>
        <PageTitle>{t("title")}</PageTitle>
        <Section>
            <Name>{t("build.name")}</Name>
            <Value>
                <ul>
                    <li>{t("build.commit")}: <Code>{generatedGitInfo.gitCommitHash}</Code></li>
                    <li>{t("build.branch")}: <Code>{generatedGitInfo.gitBranch}</Code></li>
                </ul>
            </Value>
        </Section>
    </>
}

const Code = styled.code`
    font-family: monospace;
`

export default Info
