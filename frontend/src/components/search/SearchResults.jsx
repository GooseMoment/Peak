import { Fragment } from "react"
import { useNavigate } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { getProjectColor } from "@components/project/common/palettes"
import TaskFrame from "@components/tasks/TaskFrame"

import { ImpressionArea } from "@toss/impression-area"
import { useTranslation } from "react-i18next"

const SearchResults = ({ resultPage, fetchNextResultPage }) => {
    const theme = useTheme()
    const { t } = useTranslation("", { keyPrefix: "search" })

    const navigate = useNavigate()

    const handleDrawerLink = (task) => {
        // TODO: drawer id 지정

        navigate(`../projects/${task.project_id}`)
    }

    const handleTaskLink = (task) => {
        return `../projects/${task.project_id}/tasks/${task.id}/detail`
    }

    return (
        <Container>
            {resultPage && resultPage.pages[0].results.length === 0 && (
                <NoResult>{t("no_result")}</NoResult>
            )}

            {resultPage?.pages.map((page) =>
                page.results.map((task) => {
                    const color = getProjectColor(
                        theme.type,
                        task.project_color,
                    )

                    return (
                        <Fragment key={task.id}>
                            <DrawerBox $color={color} onClick={() => handleDrawerLink(task)}>
                                <DrawerName $color={color}>
                                    {" " +
                                        task.project_name +
                                        " / " +
                                        task.drawer_name +
                                        " "}
                                </DrawerName>
                            </DrawerBox>
                            <TaskFrame task={task} color={color} taskDetailPath={handleTaskLink(task)}/>
                        </Fragment>
                    )
                }),
            )}

            <ImpressionArea
                onImpressionStart={() => fetchNextResultPage()}
                timeThreshold={200}
            />
        </Container>
    )
}

const Container = styled.div``

const NoResult = styled.div`
    margin-top: 5em;

    text-align: center;
`

export default SearchResults
