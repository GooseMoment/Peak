import { useState, useMemo } from "react"
import FilterButtonGroup from "../common/FilterButtonGroup"
import SubSection from "./SubSection"
import { useTranslation } from "react-i18next"

const DemoTheme = () => {
    const { t } = useTranslation(null, {keyPrefix: "intro.section_theme"})
    const [activeTheme, setActiveTheme] = useState("light")
    const filters = useMemo(() => makeFilters(t), [t])

    return <SubSection>
        <FilterButtonGroup active={activeTheme} setActive={setActiveTheme} filters={filters} />
        <p>selected: {activeTheme}</p>
    </SubSection>
}

const makeFilters = (t) => ({
    "light": {
        display: t("theme_light"), 
    },
    "dark": {
        display: t("theme_dark"), 
    },
})

export default DemoTheme
