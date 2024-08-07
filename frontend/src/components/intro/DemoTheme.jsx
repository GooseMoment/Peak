import { useState, useMemo } from "react"

import FilterButtonGroup from "@components/common/FilterButtonGroup"
import SubSection from "./SubSection"
import SkeletonSidebar from "./skeletons/SkeletonSidebar"
import SkeletonDrawer from "./skeletons/SkeletonDrawer"

import themes from "@assets/themes"
import { cubicBeizer } from "@assets/keyframes"

import { useTranslation } from "react-i18next"
import styled, { ThemeProvider } from "styled-components"

const DemoTheme = () => {
    const { t } = useTranslation(null, {
        keyPrefix: "intro.section_customize.demo",
    })
    const [activeTheme, setActiveTheme] = useState("light")
    const filters = useMemo(() => makeFilters(t), [t])

    return (
        <SubSection>
            <FilterButtonGroup
                active={activeTheme}
                setActive={setActiveTheme}
                filters={filters}
            />
            <Wrapper>
                <ThemeProvider theme={themes[activeTheme]}>
                    <SkeletonFrame>
                        <SkeletonSidebar />
                        <SkeletonPage>
                            <SkeletonProjectName />
                            <SkeletonDrawer />
                            <SkeletonDrawer />
                        </SkeletonPage>
                    </SkeletonFrame>
                </ThemeProvider>
            </Wrapper>
        </SubSection>
    )
}

const makeFilters = (t) => ({
    light: {
        display: t("theme_light"),
    },
    dark: {
        display: t("theme_dark"),
    },
})

const Wrapper = styled.div`
    margin: 1em;
    padding: 1em;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    & * {
        transition: background-color 0.25s ${cubicBeizer};
    }
`

const SkeletonFrame = styled.div`
    position: relative;
    display: flex;

    overflow: hidden;

    border: 1px solid ${(p) => p.theme.textColor};
    border-radius: 16px;

    height: 400px;
    aspect-ratio: 16/9;

    background-color: ${(p) => p.theme.backgroundColor};
`

const SkeletonPage = styled.div`
    position: relative;

    height: 100%;
    width: 80%;

    padding: 1.5em 3em;
`

const SkeletonProjectName = styled.div`
    border-radius: 4px;

    width: 100%;
    height: 2em;

    background-color: #74d548;
`

export default DemoTheme
