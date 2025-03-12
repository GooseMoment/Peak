import { useMemo, useState } from "react"

import styled, {
    type LightDark,
    ThemeProvider,
    useTheme,
} from "styled-components"

import FilterButtonGroup from "@components/common/FilterButtonGroup"
import SubSection from "@components/intro/SubSection"
import SkeletonDrawer from "@components/intro/skeletons/SkeletonDrawer"
import SkeletonSidebar from "@components/intro/skeletons/SkeletonSidebar"

import { ifMobile, ifTablet } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"
import { getPaletteColor } from "@assets/palettes"
import themes from "@assets/themes"

import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const DemoTheme = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_customize.demo",
    })
    const theme = useTheme()
    const [activeTheme, setActiveTheme] = useState<LightDark>(
        theme.type === "light" ? "dark" : "light",
    )
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
                            <SkeletonProjectName
                                $projectColor={getPaletteColor(
                                    activeTheme,
                                    "yellow",
                                )}
                            />
                            <SkeletonDrawer />
                            <SkeletonDrawer />
                        </SkeletonPage>
                    </SkeletonFrame>
                </ThemeProvider>
            </Wrapper>
        </SubSection>
    )
}

const makeFilters = (t: TFunction<"intro", "section_customize.demo">) => ({
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

    ${ifTablet} {
        width: unset;
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

    ${ifTablet} {
        height: 16em;
    }

    ${ifMobile} {
        height: 15em;
        aspect-ratio: 4/3;
    }
`

const SkeletonPage = styled.div`
    position: relative;

    height: 100%;
    width: 80%;

    padding: 1.5em 3em;

    ${ifMobile} {
        padding: 1.5em 1em;
        width: 100%;
    }
`

const SkeletonProjectName = styled.div<{ $projectColor: string }>`
    border-radius: 4px;

    width: 100%;
    height: 2em;

    background-color: ${(p) => p.$projectColor};
`

export default DemoTheme
