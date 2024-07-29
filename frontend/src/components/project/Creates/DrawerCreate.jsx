import { useState } from "react"
import { useParams } from "react-router-dom"

import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"
import notify from "@utils/notify"
import Title from "@components/project/common/Title"
import Middle from "@components/project/common/Middle"
import Privacy from "./Privacy"

import { postDrawer } from "@api/drawers.api"
import queryClient from "@queries/queryClient"

const DrawerCreate = ({onClose}) => {
    const { id } = useParams()

    const [name, setName] = useState('')
    const [privacy, setPrivacy] = useState('public')
    const [displayPrivacy, setDisplayPrivacy] = useState('전체공개')

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {icon: "server", display: displayPrivacy, component: <Privacy setPrivacy={setPrivacy} setDisplayPrivacy={setDisplayPrivacy} closeComponent={closeComponent}/>},
    ]

    const makeDrawer = async (name, privacy) => {
        try {
            const edit = {
                'project': id,
                'name': name,
                'privacy': privacy,
            }
            await postDrawer(edit)
            notify.success("서랍 생성에 성공하였습니다.")
        } catch (e) {
            notify.error("서랍 생성에 실패했습니다.")
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