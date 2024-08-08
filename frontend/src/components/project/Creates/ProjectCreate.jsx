import { useState } from "react"

import styled, { useTheme } from "styled-components"

import Title from "@components/project/common/Title"
import Middle from "@components/project/common/Middle"
import Color from "@components/project/Creates/Color"
import Type from "@components/project/Creates/Type"
import Privacy from "@components/project/Creates/Privacy"

import { getProjectColor, getColorDisplay } from "@components/project/Creates/palettes"

import queryClient from "@queries/queryClient"
import { postProject } from "@api/projects.api"
import { toast } from "react-toastify"

const ProjectCreate = ({onClose}) => {
    const theme = useTheme()

    const [name, setName] = useState('')
    const [color, setColor] = useState('pink')
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
        {id: 1, icon: "circle", color: getProjectColor(theme.type, color), display: getColorDisplay(color), component: <Color setColor={setColor} closeComponent={closeComponent}/>},
        {id: 2, icon: "server", display: displayPrivacy, component: <Privacy setPrivacy={setPrivacy} setDisplayPrivacy={setDisplayPrivacy} closeComponent={closeComponent}/>},
        {id: 3, icon: "award", display: displayType, component: <Type setType={setType} setDisplayType={setDisplayType} closeComponent={closeComponent}/>},
    ]

    const makeProject = async (name, color, type) => { /*privacy 추가해야함*/
        try {
            if (name === 'Inbox' || name === 'inbox') {
                toast.error("프로젝트 이름은 Inbox로 설정할 수 없습니다.")
                return
            }

            const edit = {
                'name': name,
                'color': color,
                'type': type,
            }
            await postProject(edit)
            toast.success("프로젝트 생성에 성공하였습니다.")
            onClose()
            queryClient.invalidateQueries({queryKey: ['projects']})
        } catch (e) {
            toast.error("프로젝트 생성에 실패했습니다.")
        }
    }

    const submit = async () => {
        await makeProject(name, color, type)
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