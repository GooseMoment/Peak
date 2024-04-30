import Section, { Name, Value } from "@components/settings/Section"
import PageTitle from "@components/common/PageTitle"

import generatedGitInfo from '@/generatedGitInfo.json'

import styled from "styled-components"

const Info = () => {
    return <>
        <PageTitle>Info</PageTitle>
        <Section>
            <Name>Build information</Name>
            <Value>
                <ul>
                    <li>Commit: <Code>{generatedGitInfo.gitCommitHash}</Code></li>
                    <li>Branch: <Code>{generatedGitInfo.gitBranch}</Code></li>
                </ul>
            </Value>
        </Section>
    </>
}

const Code = styled.code`
    font-family: monospace;
`

export default Info
