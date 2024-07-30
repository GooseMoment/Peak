import { useState } from "react"

import styled from "styled-components"

import Title from "@components/project/common/Title"
import Middle from "@components/project/common/Middle"
import Color from "./Color"
import Type from "./Type"

import queryClient from "@queries/queryClient"
import { postProject } from "@api/projects.api"
import { toast } from "react-toastify"

const ProjectCreate = ({onClose}) => {
    const [name, setName] = useState('')
    const [color, setColor] = useState('DC2E2E')
    const [displayColor, setDisplayColor] = useState('빨강')
    const [type, setType] = useState('regular')
    const [displayType, setDisplayType] = useState('상시 프로젝트')

     //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {icon: "circle", color: color, display: displayColor, component: <Color setColor={setColor} setDisplayColor={setDisplayColor} closeComponent={closeComponent}/>},
        {icon: "award", display: displayType, component: <Type setType={setType} setDisplayType={setDisplayType} closeComponent={closeComponent}/>}
    ]

    const makeProject = async (name, color, type) => {
        try {
            if (name === 'Inbox' || name === 'inbox') {
                toast.error("프로젝트 이름은 Inbox로 설정할 수 없습니다.")
                return 0
            }

            const edit = {
                'name': name,
                'color': color,
                'type': type,
            }
            await postProject(edit)
            toast.success("프로젝트 생성에 성공하였습니다.")
            return 1
        } catch (e) {
            toast.error("프로젝트 생성에 실패했습니다.")
            return 0
        }
    }

    const submit = async () => {
        const isSuccess = await makeProject(name, color, type)

        if (isSuccess) {
            onClose()
            queryClient.invalidateQueries({queryKey: ['projects']})
        }
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