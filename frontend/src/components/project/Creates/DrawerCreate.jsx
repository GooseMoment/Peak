import { useState } from "react"
import { useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Privacy from "@components/project/Creates/Privacy"
import Middle from "@components/project/common/Middle"
import Title from "@components/project/common/Title"

import { postDrawer } from "@api/drawers.api"

import queryClient from "@queries/queryClient"

import { cubicBeizer } from "@assets/keyframes"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerCreate = ({ onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const { id } = useParams()

    const [name, setName] = useState("")

    const [newDrawer, setNewDrawer] = useState({
        name: name,
        privacy: "public",
        project: id,
    })

    const editNewDrawer = (edit) => {
        setNewDrawer(Object.assign(newDrawer, edit))
    }

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const items = [
        {
            id: 1,
            icon: "server",
            display: t("privacy." + newDrawer.privacy),
            component: (
                <Privacy
                    setPrivacy={editNewDrawer}
                    closeComponent={closeComponent}
                />
            ),
        },
    ]

    const postMutation = useMutation({
        mutationFn: (data) => {
            return postDrawer(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: id }],
            })
            toast.success(t("create.drawer_create_success"))
            onClose()
        },
        onError: () => {
            if (newDrawer.name)
                toast.error(t("create.drawer_create_error"), {
                    toastId: "drawer_create_error",
                })
            else
                toast.error(t("create.drawer_create_no_name"), {
                    toastId: "drawer_create_no_name",
                })
        },
    })

    const submit = () => {
        editNewDrawer({ name })
        postMutation.mutate(newDrawer)
    }

    return (
        <DrawerCreateBox>
            <Title
                name={name}
                setName={setName}
                setFunc={editNewDrawer}
                isCreate
                icon="inbox"
                onClose={onClose}
            />
            <Middle
                items={items}
                isCreate
                submit={submit}
                isComponentOpen={isComponentOpen}
                setIsComponentOpen={setIsComponentOpen}
            />
        </DrawerCreateBox>
    )
}

const DrawerCreateBox = styled.div`
    width: 35em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;

    transition:
        left 0.5s ${cubicBeizer},
        width 0.5s ${cubicBeizer};

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

export default DrawerCreate
