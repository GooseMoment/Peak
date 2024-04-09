import { useRouteLoaderData, useNavigate, useOutletContext, useSubmit } from "react-router-dom"
import { Fragment } from "react"

import Detail from "@components/project/common/Detail"
import DrawerFolder from "@components/project/Creates/DrawerFolder"

const Drawer = ({ projectId, task }) => {
    const { projects } = useRouteLoaderData("app")
    const navigate = useNavigate()
    const submit = useSubmit()
    const [closeComponent] = useOutletContext()

    const changeDrawer = (drawerId) => {
        return async () => {
            submit({drawer: drawerId}, {
                method: "PATCH",
                action: "..",
            })
            navigate(`/app/projects/${projectId}/tasks/${task.id}/detail/drawer`)
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