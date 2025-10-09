import { Link } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import type { TaskGrouped } from "@api/today.api"

import { getPaletteColor } from "@assets/palettes"

export function VGraphSkeleton() {
    return (
        <Frame>
            <Graph>
                <Item to="#" $width={100} />
            </Graph>
            <Categories>
                <CategoryCircle $color="gray" />
            </Categories>
        </Frame>
    )
}

interface VGraphProps {
    items: TaskGrouped[]
    countAll: number
}

export default function VGraph({ items, countAll }: VGraphProps) {
    const theme = useTheme()

    const totalCount =
        countAll > 0
            ? countAll
            : items.reduce((sum, item) => sum + item.count, 0) || 1

    return (
        <Frame>
            <Graph draggable="false">
                {items.map((item) => (
                    <Item
                        key={item.name}
                        to={`/app/projects/${item.id}`}
                        $width={(item.count / totalCount) * 100}
                        $color={getPaletteColor(theme.type, item.color)}
                        draggable="false"
                        aria-label={`${item.name}: ${item.count} tasks`}
                    />
                ))}
            </Graph>
            <Categories>
                {items.map((item) => (
                    <Category key={item.id} to={`/app/projects/${item.id}`}>
                        <CategoryCircle
                            $color={getPaletteColor(theme.type, item.color)}
                            draggable="false"
                        />{" "}
                        {item.name}
                    </Category>
                ))}
            </Categories>
        </Frame>
    )
}

const Frame = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75em;
`

const Graph = styled.div`
    position: relative;
    border-radius: 32px;
    width: 100%;
    height: 2em;
    overflow: hidden;
`

const Item = styled(Link)<{ $width: number; $color?: string }>`
    display: inline-block;
    width: ${(p) => p.$width}%;
    height: 100%;
    background-color: ${(p) => p.$color || p.theme.grey};

    transition:
        background-color 0.5s var(--cubic),
        width 0.5s var(--cubic);
`

const Categories = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 0.5em;
`

const Category = styled(Link)`
    display: flex;
    gap: 0.25em;

    font-size: 0.75em;
    font-weight: bold;
`

const CategoryCircle = styled.div<{ $color: string }>`
    border-radius: 50%;
    aspect-ratio: 1/1;
    height: 1em;
    background-color: ${(p) => p.$color};
`
