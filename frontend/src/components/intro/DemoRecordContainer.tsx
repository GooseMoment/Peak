import { Fragment } from "react"

import { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { DemoTaskFrame } from "@components/tasks/TaskFrame"

import type { DemoMinimalTask } from "@api/tasks.api"

import { PaletteColorName, getPaletteColor } from "@assets/palettes"

export interface DemoRecord {
    drawerName: string
    color: PaletteColorName
    task: DemoMinimalTask
}

export default function DemoRecordContainer({
    record,
}: {
    record: DemoRecord[]
}) {
    const theme = useTheme()

    return (
        <div>
            {record.map((el) => {
                const color = getPaletteColor(theme.type, el.color)
                return (
                    <Fragment key={el.drawerName}>
                        <DrawerBox $color={color}>
                            <DrawerName $color={color}>
                                {el.drawerName}
                            </DrawerName>
                        </DrawerBox>
                        <DemoTaskFrame color={el.color} task={el.task} />
                    </Fragment>
                )
            })}
        </div>
    )
}
