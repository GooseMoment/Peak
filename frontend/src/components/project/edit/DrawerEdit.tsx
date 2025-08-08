import { KeyboardEvent, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import PrivacyEdit from "@components/project/edit/PrivacyEdit"
import TitleInput from "@components/project/edit/TitleInput"

import { type Drawer, patchDrawer, postDrawer } from "@api/drawers.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

type DrawerCreateInput = Pick<Drawer, "name" | "privacy" | "project">

const DrawerEdit = ({ drawer }: { drawer?: Drawer }) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit",
    })
    const { closeModal } = useModalWindowCloseContext()
    const { isDesktop } = useScreenType()

    const { id: projectID } = useParams()

    const drawerDefault = {
        name: "",
        privacy: "public" as const,
        project: projectID!,
    }

    const [newDrawer, setNewDrawer] = useState<DrawerCreateInput | Drawer>(
        drawer || drawerDefault,
    )
    const inputRef = useRef<HTMLInputElement>(null)
    const hasCreated = useRef(false)

    const mutation = useMutation({
        mutationFn: (data: Partial<Drawer>) => {
            if (drawer) {
                return patchDrawer(drawer.id, data)
            }
            return postDrawer(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })

            if (drawer) {
                toast.success(t("edited"))
            } else {
                toast.success(t("created_drawer"))
            }

            closeModal()
        },
        onError: (err) => {
            if (drawer) {
                toast.error(t("edited_error"))
                return
            }
            hasCreated.current = false

            if ("response" in err) {
                const errorCode = (err as AxiosError<{ code: string }>).response
                    ?.data?.code

                if (errorCode === "DRAWER_NAME_DUPLICATE") {
                    toast.error(t("created_drawer_error.DRAWER_NAME_DUPLICATE"))
                } else {
                    toast.error(t("created_drawer_error.UNKNOWN_ERROR"))
                }
            }
        },
    })

    const handleChange = (diff: Partial<Drawer>) => {
        setNewDrawer(Object.assign({}, newDrawer, diff))

        if (isDesktop) {
            inputRef.current?.focus()
        }
    }

    const submit = () => {
        if (mutation.isPending || hasCreated.current) {
            return
        }

        if (!drawer) {
            hasCreated.current = true
        }

        if (!newDrawer.name || newDrawer.name.trim() === "") {
            toast.error(t("name_required"))
            inputRef.current?.focus()
            return
        }

        mutation.mutate(newDrawer)
    }

    const onEnter = (e: KeyboardEvent<HTMLDivElement>) => {
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
            name: "privacy",
            icon: "server" as const,
            display: t(`privacy.${newDrawer.privacy}`),
            component: <PrivacyEdit setPrivacy={handleChange} />,
        },
    ]

    return (
        <EditBox onKeyDown={onEnter}>
            <TitleInput
                name={newDrawer.name}
                setName={(name: string) => handleChange({ name })}
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
                    {t(drawer ? "button_save" : "button_add")}
                </Button>
            </ButtonGroup>
        </EditBox>
    )
}

export default DrawerEdit
