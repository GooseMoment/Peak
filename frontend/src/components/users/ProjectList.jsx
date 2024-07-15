import { Section, SectionTitle } from "@components/users/Section"

import styled from "styled-components"

const ProjectList = ({projects}) => {
    return <Section>
        <SectionTitle>Projects</SectionTitle>

        <Projects>
            {projects.map(project => <Project key={project.id}>
                <Circle $color={"#" + project.color} /> <Name>{project.name}</Name> 
            </Project>)}
        </Projects>

    </Section>
}

const Projects = styled.div`
    display: flex;
    gap: 1.5em;
    margin-top: 1.5em;
`

const Project = styled.div`
    display: flex;
    gap: 0.25em;
    font-size: 1.25em;
    align-items: center;
`

const Circle = styled.div`
    border-radius: 50%;
    background-color: ${p => p.$color};

    aspect-ratio: 1/1;
    height: 1em;
`

const Name = styled.div``

export default ProjectList
