import { useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Privacy from "@components/project/Creates/Privacy"
import Middle from "@components/project/common/Middle"
import TitleInput from "@components/project/common/TitleInput"
import EditBox from "@components/project/edit/EditBox"

import { postDrawer } from "@api/drawers.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerCreate = () => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const { id } = useParams()

    const inputRef = useRef(null)
    const [name, setName] = useState("")

    const [newDrawer, setNewDrawer] = useState({
        name: name,
        privacy: "public",
        project: id,
    })

    const { closeModal } = useModalWindowCloseContext()

    const editNewDrawer = (edit) => {
        setNewDrawer(Object.assign(newDrawer, edit))
        inputRef.current.focus()
    }

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const items = [
        {
            id: 1,
            icon: "server",
            display: t("privacy." + newDrawer.privacy),
            component: <Privacy setPrivacy={editNewDrawer} />,
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
            closeModal()
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

    const onEnter = (e) => {
        if (e.key === "Enter") {
            submit()
        }
    }

    return (
        <EditBox onKeyDown={onEnter}>
            <TitleInput
                name={name}
                setName={setName}
                setFunc={editNewDrawer}
                inputRef={inputRef}
                isCreate
                icon="inbox"
                onClose={closeModal}
            />
            <Middle
                items={items}
                isCreate
                submit={submit}
                isComponentOpen={isComponentOpen}
                setIsComponentOpen={setIsComponentOpen}
                disabled={postMutation.isPending}
            />
        </EditBox>
    )
}

export default DrawerCreate
