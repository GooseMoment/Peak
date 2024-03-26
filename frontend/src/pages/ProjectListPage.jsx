const ProjectListPage = () => {
    const projects = useLoaderData()

    return(
        <>
            {projects && projects.map((project) => <div>{project.name}</div>)}
        </>
    )
}

export default ProjectListPage