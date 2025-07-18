import { useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import Privacy from "@components/project/edit/Privacy"
import TitleInput from "@components/project/edit/TitleInput"

import { patchDrawer, postDrawer } from "@api/drawers.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerEdit = ({ drawer, isCreating = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_drawer_edit" })
    const { closeModal } = useModalWindowCloseContext()
    const { isDesktop } = useScreenType()

    const { id: projectID } = useParams()
    const [newDrawer, setNewDrawer] = useState(
        isCreating
            ? {
                  name: "",
                  privacy: "public",
                  project: projectID,
              }
            : drawer,
    )
    const inputRef = useRef(null)
    const hasCreated = useRef(false)

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isCreating) {
                return postDrawer(data)
            }

            return patchDrawer(drawer.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })

            if (isCreating) {
                toast.success(t("created_drawer"))
            } else {
                toast.success(t("edited"))
            }

            closeModal()
        },
        onError: (err) => {
            if (isCreating) {
                hasCreated.current = false

                const errorCode = err?.response?.data?.code
                toast.error(t("created_drawer_error." + errorCode))

                return
            }

            toast.error(t("edited_error"))
        },
    })

    const handleChange = (diff) => {
        setNewDrawer(Object.assign({}, newDrawer, diff))

        if (isDesktop) {
            inputRef.current.focus()
        }
    }

    const submit = () => {
        if (mutation.isPending || hasCreated.current) {
            return
        }

        if (isCreating) {
            hasCreated.current = true
        }

        if (!newDrawer.name || newDrawer.name.trim() === "") {
            toast.error(t("name_required"))
            inputRef.current.focus()
            return
        }

        mutation.mutate(newDrawer)
    }

    const onEnter = (e) => {
        if (e.repeat) {
            e.preventDefault()
            return
        }

        if (e.key !== "Enter") {
            return
        }

        submit()
    }

    const items = [
        {
            id: "privacy",
            icon: "server",
            display: t("privacy." + newDrawer.privacy),
            component: <Privacy setPrivacy={handleChange} />,
        },
    ]

    return (
        <EditBox onKeyDown={onEnter}>
            <TitleInput
                name={newDrawer.name}
                setName={(name) => handleChange({ name })}
                inputRef={inputRef}
                icon="inbox"
                onClose={closeModal}
            />
            <Middle items={items} />
            <ButtonGroup $justifyContent="right">
                <Button
                    disabled={mutation.isPending}
                    loading={mutation.isPending}
                    onClick={submit}>
                    {t(isCreating ? "button_add" : "button_save")}
                </Button>
            </ButtonGroup>
        </EditBox>
    )
}

export default DrawerEdit
