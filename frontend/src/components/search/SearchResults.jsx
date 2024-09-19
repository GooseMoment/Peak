import styled from "styled-components"

import TaskFrame from "@components/tasks/TaskFrame"
import { Fragment } from "react"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"

const SearchResults = ({ searchResults }) => {
    return (
        <Wrapper>
            {searchResults?.map((task) => (
                <Fragment key={task.id}>
                    <DrawerBox $color={task.color}>
                        <DrawerName $color={task.color}>
                            {" " + task.project_name + " / " + task.drawer_name + " "}
                        </DrawerName>
                    </DrawerBox>
                    <TaskFrame task={task} color={task.color}/>
                </Fragment>
            ))}
        </Wrapper>
    )
}

const Wrapper = styled.div``

export default SearchResults
