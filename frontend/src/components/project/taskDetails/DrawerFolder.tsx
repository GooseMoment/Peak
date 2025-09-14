import { Fragment, useState } from "react"

import styled, { useTheme } from "styled-components"

import { type Drawer } from "@api/drawers.api"

import { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"

const DrawerFolder = ({
    drawers,
    changeDrawer,
}: {
    drawers: Drawer[]
    changeDrawer: (drawer: Drawer) => () => void
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const theme = useTheme()

    if (drawers.length === 0) return null

    const project = drawers[0].project

    return (
        <>
            <ItemBox
                onClick={
                    project.type === "inbox"
                        ? changeDrawer(drawers[0])
                        : () => setCollapsed((prev) => !prev)
                }>
                <Circle $color={getPaletteColor(theme.type, project.color)} />
                <ItemText $isProject>{project.name}</ItemText>
            </ItemBox>

            {!collapsed &&
                project.type !== "inbox" &&
                drawers.map((drawer) => (
                    <Fragment key={drawer.id}>
                        <ItemBox onClick={changeDrawer(drawer)}>
                            <FeatherIcon icon="arrow-right" />
                            <ItemText $isProject={false}>
                                {drawer.name}
                            </ItemText>
                        </ItemBox>
                    </Fragment>
                ))}
        </>
    )
}

const Circle = styled.div<{ $color: string }>`
    position: relative;
    width: 1.1em;
    height: 1.1em;
    background-color: ${(props) => props.$color};
    border-radius: 50%;
    margin-right: 0.6em;
`

const ItemBox = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 1.2em 0em;
    margin-left: 1.2em;

    & svg {
        margin-left: 1.3em;
        top: 0;
        color: ${(p) => p.theme.textColor};
    }

    ${ifMobile} {
        width: 100%;
        margin-left: 0.2em;
        margin: 0.4em 0em;
    }
`

const ItemText = styled.div<{ $isProject: boolean }>`
    width: 70%;
    font-weight: ${(props) => (props.$isProject ? "500" : "normal")};
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: clip;

    &:hover {
        font-weight: bolder;
        color: ${(p) => p.theme.goose};
        cursor: pointer;
    }

    ${ifMobile} {
        width: 95%;
    }
`

export default DrawerFolder
