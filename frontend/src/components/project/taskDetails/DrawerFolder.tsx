import { Fragment, ReactElement, useState } from "react"

import type { useInfiniteQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import { type PaginationData } from "@api/common"
import { type Drawer } from "@api/drawers.api"

import { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"

const DrawerFolder = ({
    drawers,
    changeDrawer,
}: {
    drawers:
        | ReturnType<
              typeof useInfiniteQuery<PaginationData<Drawer>, unknown>
          >["data"]
        | undefined
    changeDrawer: (drawer: Drawer) => () => void
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const theme = useTheme()

    let lastProjectID: null | string = null

    return drawers?.pages?.map((group) =>
        group?.results?.map((drawer) => {
            let projectInsertion: null | ReactElement = null

            if (lastProjectID !== drawer.project.id) {
                lastProjectID = drawer.project.id

                projectInsertion = (
                    <ItemBox
                        onClick={
                            drawer.project.type === "inbox"
                                ? changeDrawer(drawer)
                                : () => setCollapsed((prev) => !prev)
                        }>
                        <Circle
                            $color={getPaletteColor(
                                theme.type,
                                drawer.project.color,
                            )}
                        />
                        <ItemText $isProject={true}>
                            {drawer.project.name}
                        </ItemText>
                    </ItemBox>
                )
            }

            return (
                <Fragment key={drawer.id}>
                    {projectInsertion}
                    {drawer.project.type === "inbox" || collapsed ? null : (
                        <ItemBox onClick={changeDrawer(drawer)}>
                            <FeatherIcon icon="arrow-right" />
                            <ItemText $isProject={false}>
                                {drawer.name}
                            </ItemText>
                        </ItemBox>
                    )}
                </Fragment>
            )
        }),
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
