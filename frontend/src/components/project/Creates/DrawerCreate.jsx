import { useState } from "react"
import { useParams } from "react-router-dom"

import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"
import Title from "@components/project/common/Title"
import Middle from "@components/project/common/Middle"
import Privacy from "./Privacy"

import { postDrawer } from "@api/drawers.api"
import queryClient from "@queries/queryClient"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerCreate = ({onClose}) => {
    const { t } = useTranslation(null, {keyPrefix: "project.create"})
    const { id } = useParams()

    const [name, setName] = useState('')
    const [privacy, setPrivacy] = useState('public')

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {id: 1, icon: "server", display: t("privacy." + privacy), component: <Privacy setPrivacy={setPrivacy} closeComponent={closeComponent}/>},
    ]

    const makeDrawer = async (name, privacy) => {
        try {
            const edit = {
                'project': id,
                'name': name,
                'privacy': privacy,
            }
            await postDrawer(edit)
            toast.success(t("drawer_create_success"))
        } catch (e) {
            toast.error(t("drawer_create_error"))
        }
    }

    const submit = async (e) => {
        await makeDrawer(name, privacy)
        onClose()
        queryClient.invalidateQueries({queryKey: ['projects', id]})
    }

    return (
        <DrawerBox>
            <Title name={name} setName={setName} icon="inbox" onClose={onClose}/>
            <Middle items={items} submit={submit} isComponentOpen={isComponentOpen} setIsComponentOpen={setIsComponentOpen}/>
        </DrawerBox>
    )
}

const DrawerBox = styled.div`
    width: 35em;
    background-color: ${p => p.theme.backgroundColor};
    border: solid 1px ${p => p.theme.project.borderColor};
    border-radius: 15px;

    transition: left 0.5s ${cubicBeizer}, width 0.5s ${cubicBeizer};

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

export default DrawerCreate