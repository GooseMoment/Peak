import { useEffect, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Privacy from "@components/project/Creates/Privacy"
import Middle from "@components/project/common/Middle"
import Title from "@components/project/common/Title"

import { patchDrawer } from "@api/drawers.api"

import queryClient from "@queries/queryClient"

import { cubicBeizer } from "@assets/keyframes"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerEdit = ({ projectID, drawer }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const { closeModal } = useModalWindowCloseContext()

    const [name, setName] = useState(drawer.name)

    useEffect(() => {
        setName(drawer.name)
    }, [drawer])

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchDrawer(drawer.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })
        },
        onError: () => {
            toast.error(t("edit.drawer_change_error"))
        },
    })

    const items = [
        {
            id: 1,
            icon: "server",
            display: t("privacy." + drawer.privacy),
            component: <Privacy setPrivacy={patchMutation.mutate} />,
        },
    ]

    return (
        <DrawerEditBox>
            <Title
                name={name}
                setName={setName}
                setFunc={patchMutation.mutate}
                isCreate={false}
                icon="inbox"
                onClose={closeModal}
            />
            <Middle
                items={items}
                isCreate={false}
                isComponentOpen={isComponentOpen}
                setIsComponentOpen={setIsComponentOpen}
            />
        </DrawerEditBox>
    )
}

const DrawerEditBox = styled.div`
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

export default DrawerEdit
