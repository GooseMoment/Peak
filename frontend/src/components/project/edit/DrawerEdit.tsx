import { KeyboardEvent, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import PrivacyEdit from "@components/project/edit/PrivacyEdit"
import TitleInput from "@components/project/edit/TitleInput"

import {
    type Drawer,
    type DrawerCreate,
    DrawerLimitExceeded,
    DrawerNameDuplicate,
    patchDrawer,
    postDrawer,
} from "@api/drawers.api"

import { useModalContext } from "@utils/useModal"
import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import type { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerEdit = ({ drawer }: { drawer?: Drawer }) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit",
    })
    const modal = useModalContext()
    const { isDesktop } = useScreenType()

    const { id: projectID } = useParams()

    const drawerDefault = {
        name: "",
        privacy: "public" as const,
        project: projectID!,
    }

    const [newDrawer, setNewDrawer] = useState<DrawerCreate | Drawer>(
        drawer || drawerDefault,
    )
    const inputRef = useRef<HTMLInputElement>(null)
    const hasCreated = useRef(false)

    const postMutation = useMutation({
        mutationFn: (data: DrawerCreate) => {
            return postDrawer(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })
            toast.success(t("created_drawer"))
            modal?.closeModal()
        },
        onError: (err) => {
            hasCreated.current = false

            if ("response" in err) {
                const errorCode = (err as AxiosError<{ code: string }>).response
                    ?.data?.code

                if (
                    errorCode === DrawerLimitExceeded ||
                    errorCode === DrawerNameDuplicate
                ) {
                    toast.error(t(`created_drawer_error.${errorCode}`))
                } else {
                    toast.error(t("created_drawer_error.UNKNOWN_ERROR"))
                }
            }
        },
    })

    const patchMutation = useMutation({
        mutationFn: (data: Drawer) => {
            const drawerData = { ...data, project: data.project.id }
            return patchDrawer(data.id!, drawerData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })
            toast.success(t("edited"))
            modal?.closeModal()
        },
        onError: () => {
            toast.error(t("edited_error"))
        },
    })

    const handleChange = (diff: Partial<Drawer>) => {
        setNewDrawer(Object.assign({}, newDrawer, diff))

        if (isDesktop) {
            inputRef.current?.focus()
        }
    }

    const submit = () => {
        if (
            postMutation.isPending ||
            patchMutation.isPending ||
            hasCreated.current
        ) {
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

        if (drawer) {
            patchMutation.mutate(newDrawer as Drawer)
        } else {
            postMutation.mutate(newDrawer as DrawerCreate)
        }
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
                onClose={() => modal?.closeModal()}
            />
            <Middle items={items} />
            <ButtonGroup $justifyContent="right">
                <Button
                    disabled={postMutation.isPending || patchMutation.isPending}
                    loading={postMutation.isPending || patchMutation.isPending}
                    onClick={submit}>
                    {t(drawer ? "button_save" : "button_add")}
                </Button>
            </ButtonGroup>
        </EditBox>
    )
}

export default DrawerEdit
