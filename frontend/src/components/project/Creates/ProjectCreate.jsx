import { useState } from "react"

import styled from "styled-components"

import Title from "@components/project/common/Title"
import Middle from "@components/project/common/Middle"
import Color from "./Color"
import Type from "./Type"
import Privacy from "./Privacy"

import queryClient from "@queries/queryClient"
import { postProject } from "@api/projects.api"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const ProjectCreate = ({onClose}) => {
    const { t } = useTranslation(null, {keyPrefix: "project.create"})

    const [name, setName] = useState('')
    const [color, setColor] = useState('DC2E2E')
    const [displayColor, setDisplayColor] = useState('빨강')
    const [type, setType] = useState('regular')
    const [privacy, setPrivacy] = useState('public')

     //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {id: 1, icon: "circle", color: color, display: displayColor, component: <Color setColor={setColor} setDisplayColor={setDisplayColor} closeComponent={closeComponent}/>},
        {id: 2, icon: "server", display: t("privacy." + privacy), component: <Privacy setPrivacy={setPrivacy} closeComponent={closeComponent}/>},
        {id: 3, icon: "award", display: t("type." + type), component: <Type setType={setType} closeComponent={closeComponent}/>},
    ]

    const makeProject = async (name, color, type) => { /*privacy 추가해야함*/
        try {
            if (name === 'Inbox' || name === 'inbox') {
                toast.error(t("project_create_cannot_use_inbox"))
                return
            }

            const edit = {
                'name': name,
                'color': color,
                'type': type,
            }
            await postProject(edit)
            toast.success(t("project_create_success"))
            onClose()
            queryClient.invalidateQueries({queryKey: ['projects']})
        } catch (e) {
            toast.error(t("project_create_error"))
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