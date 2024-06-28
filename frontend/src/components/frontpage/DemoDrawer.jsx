import { useMemo } from "react"

import SubSection, { SubTitle } from "@components/frontpage/SubSection"
import DrawerBox, { DrawerName } from "@components/project/DrawerBox"

import { useTranslation } from "react-i18next"
import PageTitle from "../common/PageTitle"

const DemoDrawer = () => {
    const {t} = useTranslation(null, {keyPrefix: "frontpage.section_organize.Sub_drawer"}) 
    const drawers = useMemo(() => makeDrawers(t), [t])

    return <SubSection>
        <SubTitle>A drawer is home for tasks.</SubTitle>

        <PageTitle $color="#FD99E1">한양라이프</PageTitle>
        {drawers?.map(drawer => <DrawerBox key={drawer.color} $color={drawer.color} $demo>
            <DrawerName $color={drawer.color} $demo>{drawer.name}</DrawerName>
        </DrawerBox>)}
    </SubSection>
}

const makeDrawers = (t) => [
    {
        name: t("drawers.drawer1"),
        color: "FD99E1",
    },
    {
        name: t("drawers.drawer2"),
        color: "#",
    },
    {
        name: t("drawers.drawer3"),
        color: "#",
    },
    {
        name: t("drawers.drawer4"),
        color: "#",
    },
    {
        name: t("drawers.drawer5"),
        color: "#",
    },
]

export default DemoDrawer
