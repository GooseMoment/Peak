import { useRouteLoaderData, useNavigate } from "react-router-dom"
import { Fragment } from "react"

import Detail from "@components/project/common/Detail"
import DrawerFolder from "@components/project/Creates/DrawerFolder"

const Drawer = ({ projectID: projectID, task, setFunc, closeComponent }) => {
    const { projects } = useRouteLoaderData("app")
    const navigate = useNavigate()

    const changeDrawer = (drawerId) => {
        return async () => {
            setFunc({drawer: drawerId})
            navigate(`/app/projects/${projectID}/tasks/${task.id}/detail`)
            closeComponent()
        }
    }

    return (
        <Detail title="서랍 선택" onClose={closeComponent}>
            {projects.map((project) => (
                <Fragment key={project.id}>
                    <DrawerFolder project={project} changeDrawer={changeDrawer}/>
                </Fragment>
            ))}
        </Detail>
    )
}

export default Drawer