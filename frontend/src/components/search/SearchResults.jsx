import { Fragment } from "react"

import styled from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import TaskFrame from "@components/tasks/TaskFrame"

const SearchResults = ({ resultPage, fetchNextResultPage }) => {
    return (
        <Container>
            {resultPage?.pages.map((page) =>
                page.results.map((task) => (
                    <Fragment key={task.id}>
                        <DrawerBox $color={task.color}>
                            <DrawerName $color={task.color}>
                                {" " +
                                    task.project_name +
                                    " / " +
                                    task.drawer_name +
                                    " "}
                            </DrawerName>
                        </DrawerBox>
                        <TaskFrame task={task} color={task.color} />
                    </Fragment>
                )),
            )}
            <button onClick={() => fetchNextResultPage()}>test</button>
        </Container>
    )
}

const Container = styled.div``

export default SearchResults
