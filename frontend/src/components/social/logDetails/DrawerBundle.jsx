import styled from "styled-components"

import { TaskList } from "@components/drawers/Drawer"
import TaskBox from "@components/social/logDetails/TaskBox"
import { Fragment } from "react"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"

const DrawerBundle = ({ drawer, isFollowing }) => {
    return (
        <Fragment>
            <DrawerBox $color={drawer.color}>
                <DrawerName $color={drawer.color}> {drawer.name} </DrawerName>
            </DrawerBox>
            <TaskList>
                {/* {drawer.tasks.map((task) => (
                    <TaskBox
                    key={task.id}
                task={task}
                color={drawer.color}
                isFollowing={isFollowing}
                />
                ))} */}
            </TaskList>
        </Fragment>
    )

    // <TaskList>
    //         {drawer.tasks.map((task) => (
    //             <TaskBox
    //                 key={task.id}
    //                 task={task}
    //                 color={drawer.color}
    //                 isFollowing={isFollowing}
    //             />
    //         ))}
    //     </TaskList>
}

export default DrawerBundle
