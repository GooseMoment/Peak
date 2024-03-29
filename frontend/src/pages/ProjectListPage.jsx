import { useRouteLoaderData } from "react-router-dom"

const ProjectListPage = () => {
    const {projects} = useRouteLoaderData("app")

    return(
        <>
            {projects && projects.map((project) => <div>{project.name}</div>)}
        </>
    )
}

export default ProjectListPage