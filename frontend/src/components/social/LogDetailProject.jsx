import styled from "styled-components"
import LogDetailTask from "@components/social/LogDetailTask"

const LogDetailProject = ({project}) => {
    return <ProjectContainer>
        <ProjectHeader $color = {project.projectColor}>
            {project.projectID}
        </ProjectHeader>
        {project.dailytasks.map((task) => (
            <LogDetailTask task={task} color={project.projectColor}/>
        ))}


    </ProjectContainer>
}

const ProjectContainer = styled.div`
margin: 0 0 1rem;

`

const ProjectHeader = styled.div`
display: flex;
height: 3rem;

border-radius: 0.75rem 0.75rem 0 0;
background-color: ${props => props.$color};

align-items: center;
padding: 0 1.5rem 0;
color: white;
font-size: 1.5rem;
font-weight: bold;
`

export default LogDetailProject