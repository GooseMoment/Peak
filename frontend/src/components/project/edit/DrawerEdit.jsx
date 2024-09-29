import { useEffect, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Privacy from "@components/project/Creates/Privacy"
import Middle from "@components/project/common/Middle"
import TitleInput from "@components/project/common/TitleInput"
import EditBox from "@components/project/edit/EditBox"

import { patchDrawer } from "@api/drawers.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const DrawerEdit = ({ projectID, drawer }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const { closeModal } = useModalWindowCloseContext()

    const inputRef = useRef(null)
    const [name, setName] = useState(drawer.name)

    useEffect(() => {
        setName(drawer.name)
    }, [drawer])

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
        <EditBox>
            <TitleInput
                name={name}
                setName={setName}
                setFunc={patchMutation.mutate}
                inputRef={inputRef}
                isCreate={false}
                icon="inbox"
                onClose={closeModal}
            />
            <Middle items={items} isCreate={false} />
        </EditBox>
    )
}

export default DrawerEdit
