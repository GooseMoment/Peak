import { useState } from "react"
import { useRevalidator } from "react-router-dom"

import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"
import TitleFrame from "@components/project/common/Title"
import MiddleFrame from "@components/project/common/Middle"
import notify from "@utils/notify"
import Color from "./Color"
import Type from "./Type"

import { postProject } from "@api/projects.api"

const ProjectCreate = ({onClose}) => {
    const revalidator = useRevalidator()

    const [name, setName] = useState('')
    const [color, setColor] = useState('')
    const [displayColor, setDisplayColor] = useState('')
    const [type, setType] = useState('')
    const [displayType, setDisplayType] = useState('')

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
        revalidator.revalidate()
    }

    return (
        <ProjectBox>
            <TitleFrame name={name} setName={setName} icon="archive" onClose={onClose}/>
            <MiddleFrame items={items} submit={submit} isComponentOpen={isComponentOpen} setIsComponentOpen={setIsComponentOpen}/>
        </ProjectBox>
    )
}

const ProjectBox = styled.div`
    width: 35em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;

    transition: left 0.5s ${cubicBeizer}, width 0.5s ${cubicBeizer};
    
    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

export default ProjectCreate