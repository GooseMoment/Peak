import { type ReactElement } from "react"
import { Fragment } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"

import TaskBox from "./logDetails/TaskBox"

import { getDailyRecord } from "@api/social.api"
import type { User } from "@api/users.api"

import { getPageFromURL } from "@utils/pagination"

import { getPaletteColor } from "@assets/palettes"

import type { DateTime } from "luxon"

interface RecordContainerProps {
    username: User["username"]
    date: DateTime
}

export default function RecordContainer({
    username,
    date,
}: RecordContainerProps) {
    const theme = useTheme()
    const { data, isPending, isError } = useInfiniteQuery({
        queryKey: ["records", username, date.toISODate()],
        queryFn: (page) =>
            getDailyRecord(username, date.toISODate()!, page.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    if (isPending) {
        return <div>Loading</div>
    }

    if (isError) {
        return <div>Error</div>
    }

    let lastDrawerID: null | string = null
    let lastColor = ""

    return (
        <div>
            {data.pages.map((page) =>
                page.results.map((task) => {
                    let drawerInsertion: null | ReactElement = null

                    // TODO: replace task.drawer with task.drawer_id after Task fields modification
                    if (lastDrawerID !== task.drawer) {
                        lastDrawerID = task.drawer
                        lastColor = getPaletteColor(
                            theme.type,
                            task.project_color,
                        )

                        drawerInsertion = (
                            <DrawerBox $color={lastColor}>
                                <DrawerName $color={lastColor}>
                                    {task.drawer_name}
                                </DrawerName>
                            </DrawerBox>
                        )
                    }

                    return (
                        <Fragment key={task.id}>
                            {drawerInsertion}
                            <TaskBox
                                task={task}
                                color={lastColor}
                                isFollowingPage
                            />
                        </Fragment>
                    )
                }),
            )}
        </div>
    )
}
