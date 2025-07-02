import { useState } from "react"

import styled, { useTheme } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"

const DrawerFolder = ({ project, changeDrawer }) => {
    const [collapsed, setCollapsed] = useState(false)
    const theme = useTheme()

    return (
        <>
            <ItemBox
                onClick={
                    project.type === "inbox"
                        ? changeDrawer(
                              project.drawers[0].id,
                              project.drawers[0].name,
                              project.id,
                              project.name,
                              project.color,
                          )
                        : () => setCollapsed((prev) => !prev)
                }>
                <Circle $color={getPaletteColor(theme.type, project.color)} />
                <ItemText $is_project={true}>{project.name}</ItemText>
            </ItemBox>
            {project.type === "inbox" || collapsed
                ? null
                : project.drawers &&
                  project.drawers.map((drawer) => (
                      <ItemBox
                          key={drawer.id}
                          onClick={changeDrawer(
                              drawer.id,
                              drawer.name,
                              project.id,
                              project.name,
                              project.color,
                          )}>
                          <FeatherIcon icon="arrow-right" />
                          <ItemText $is_project={false}>{drawer.name}</ItemText>
                      </ItemBox>
                  ))}
        </>
    )
}

const Circle = styled.div`
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

const ItemText = styled.div`
    width: 70%;
    font-weight: ${(props) => (props.$is_project ? "500" : "normal")};
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
