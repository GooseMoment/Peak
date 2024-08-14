import { useMemo, useState } from "react"

import styled from "styled-components"

import DemoBlurb from "@components/intro/DemoBlurb"
import DemoLogs from "@components/intro/DemoLogs"
import SubSection from "@components/intro/SubSection"

import { ifMobile } from "@utils/useScreenType"

import { useTranslation } from "react-i18next"

const DemoShare = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_share.demo_share",
    })

    const [selected, setSelected] = useState(0)
    const logs = useMemo(() => makeLogs(t), [t])

    return (
        <SubSectionFlex>
            <DemoLogs
                logs={logs}
                selected={selected}
                setSelected={setSelected}
            />
            <DemoBlurb log={logs[selected]} selected={selected} />
        </SubSectionFlex>
    )
}

const makeLogs = (t) => [
    {
        username: "@alpaca",
        preview: t("logs.log0.preview"),
        colors: ["#E30F25", "#0C7BBB", "#F8C112", "#E30F25"],
        profile_img: "https://alpha-media.peak.ooo/static/alpaca.jpg",
        blurb: t("logs.log0.blurb"),
        tasks: [
            {
                id: 0,
                name: t("logs.log0.tasks.task0"),
            },
            {
                id: 1,
                name: t("logs.log0.tasks.task1"),
            },
            {
                id: 2,
                name: t("logs.log0.tasks.task2"),
            },
        ],
    },
    {
        username: "@quokka",
        preview: t("logs.log1.preview"),
        colors: ["#7F1184", "#F6ADC6", "#7A99CF", "#7F1184"],
        profile_img: "https://alpha-media.peak.ooo/static/quokka.jpeg",
        blurb: t("logs.log1.blurb"),
        tasks: [
            {
                id: 0,
                name: t("logs.log1.tasks.task0"),
            },
            {
                id: 1,
                name: t("logs.log2.tasks.task1"),
            },
            {
                id: 2,
                name: t("logs.log3.tasks.task2"),
            },
        ],
    },
    {
        username: "@sloth",
        preview: t("logs.log2.preview"),
        colors: ["#A0E7EF", "#7CFC00", "#F29C47", "#A0E7EF"],
        profile_img: "https://alpha-media.peak.ooo/static/sloth.jpeg",
        blurb: t("logs.log2.blurb"),
        tasks: [
            {
                id: 0,
                name: t("logs.log2.tasks.task0"),
            },
            {
                id: 1,
                name: t("logs.log2.tasks.task1"),
            },
            {
                id: 2,
                name: t("logs.log2.tasks.task2"),
            },
        ],
    },
    {
        username: "@golden",
        preview: t("logs.log3.preview"),
        colors: ["#F68B1F", "#00AFCC", "#EA533A", "#F68B1F"],
        profile_img:
            "https://alpha-media.peak.ooo/static/golden-retriever.jpeg",
        blurb: t("logs.log3.blurb"),
        tasks: [
            {
                id: 0,
                name: t("logs.log3.tasks.task0"),
            },
            {
                id: 1,
                name: t("logs.log3.tasks.task1"),
            },
            {
                id: 2,
                name: t("logs.log3.tasks.task2"),
            },
        ],
    },
]

const SubSectionFlex = styled(SubSection)`
    display: flex;
    flex-wrap: nowrap;
    justify-content: stretch;
    gap: 1.25em;

    ${ifMobile} {
        flex-wrap: wrap;
    }
`

export default DemoShare
