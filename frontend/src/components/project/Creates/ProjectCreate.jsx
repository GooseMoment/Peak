import { useState } from "react"

import styled from "styled-components"

import Title from "@components/project/common/Title"
import Middle from "@components/project/common/Middle"
import notify from "@utils/notify"
import Color from "./Color"
import Type from "./Type"
import Privacy from "./Privacy"

import queryClient from "@queries/queryClient"
import { postProject } from "@api/projects.api"

const ProjectCreate = ({onClose}) => {
    const [name, setName] = useState('')
    const [color, setColor] = useState('DC2E2E')
    const [displayColor, setDisplayColor] = useState('빨강')
    const [type, setType] = useState('regular')
    const [displayType, setDisplayType] = useState('상시 프로젝트')
    const [privacy, setPrivacy] = useState('public')
    const [displayPrivacy, setDisplayPrivacy] = useState('전체공개')

     //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {id: 1, icon: "circle", color: color, display: displayColor, component: <Color setColor={setColor} setDisplayColor={setDisplayColor} closeComponent={closeComponent}/>},
        {id: 2, icon: "server", display: displayPrivacy, component: <Privacy setPrivacy={setPrivacy} setDisplayPrivacy={setDisplayPrivacy} closeComponent={closeComponent}/>},
        {id: 3, icon: "award", display: displayType, component: <Type setType={setType} setDisplayType={setDisplayType} closeComponent={closeComponent}/>},
    ]

    const makeProject = async (name, color, type) => { /*privacy 추가해야함*/
        try {
            const edit = {
                'name': name,
                'color': color,
                'type': type,
            }
            await postProject(edit)
            notify.success("프로젝트 생성에 성공하였습니다.")
        } catch (e) {
            notify.error("프로젝트 생성에 실패했습니다.")
        }
    }

    const submit = async (e) => {
        await makeProject(name, color, type)
        onClose()
        queryClient.invalidateQueries({queryKey: ['projects']})
    }

    return (
        <ProjectBox>
            <Title name={name} setName={setName} icon="archive" onClose={onClose}/>
            <Middle items={items} submit={submit} isComponentOpen={isComponentOpen} setIsComponentOpen={setIsComponentOpen}/>
        </ProjectBox>
    )
}

const ProjectBox = styled.div`
    width: 35em;
    background-color: ${p => p.theme.backgroundColor};
    border: solid 1px ${p => p.theme.project.borderColor};
    border-radius: 15px;
    
    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

export default ProjectCreate