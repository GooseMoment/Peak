import { Fragment } from "react"

import { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import TaskFrame from "@components/tasks/TaskFrame"

import type { Task } from "@api/tasks.api"

import { getPaletteColor } from "@assets/palettes"

export function DemoRecord({ record }: { record: Task[] }) {
    const theme = useTheme()

    return (
        <div>
            {record.map((task) => {
                const color = getPaletteColor(
                    theme.type,
                    task.drawer.project.color,
                )
                return (
                    <Fragment key={task.id}>
                        <DrawerBox $color={color}>
                            <DrawerName $color={color}>
                                {task.drawer.name}
                            </DrawerName>
                        </DrawerBox>
                        <TaskFrame task={task} />
                    </Fragment>
                )
            })}
        </div>
    )
}
