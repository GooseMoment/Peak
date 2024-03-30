import { useRouteLoaderData } from "react-router-dom"
import { useState, Fragment } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import DetailFrame from "@components/project/common/DetailFrame"

import { patchTask } from "@api/tasks.api"

const Drawer = ({ taskId, setTasks, onClose }) => {
    const {projects} = useRouteLoaderData("app")
    const [collapsed, setCollapsed] = useState(false)

    const changeDrawer = (id, drawerId) => {
        return async () => {
            const edit = {
                'drawer': drawerId,
            }
            await patchTask(id, edit)
            setTasks(prev => prev.map((task) => {
                if (task.id === taskId) {
                    task.drawer = drawerId
                    return task
                }
                return task
            }))
            location.reload()
        }
    }

    return (
        <DetailFrame title="서랍 선택" onClose={onClose}>
            {projects.map((project) => (
                <Fragment key={project.id}>
                    <ItemBox onClick={() => setCollapsed(prev => !prev)}>
                        <Circle $color={project.color}/>
                        <ItemText $is_project={true}>{project.name}</ItemText>
                    </ItemBox>
                    {collapsed ? null : 
                        project.drawers && project.drawers.map(drawer => (
                        <ItemBox key={drawer.id} onClick={changeDrawer(taskId, drawer.id)}>
                            <FeatherIcon icon="arrow-right"/>
                            <ItemText $is_project={false}>{drawer.name}</ItemText>
                        </ItemBox>
                    ))}
                </Fragment>
            ))}
        </DetailFrame>
    )
}

const Circle = styled.div`
    position: relative;
    width: 1.1em;
    height: 1.1em;
    background-color: #${props => props.$color};
    border-radius: 50%;
    margin-right: 0.6em;
`

const ItemBox = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        margin-left: 1.3em;
        top: 0;
    }
`

const ItemText = styled.div`
    font-weight: ${props => props.$is_project ? '500' : 'normal'};
    font-size: 1em;
    color: #000000;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

export default Drawer