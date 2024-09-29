import { useEffect, useMemo, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useTheme } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Color from "@components/project/Creates/Color"
import Privacy from "@components/project/Creates/Privacy"
import Type from "@components/project/Creates/Type"
import { getProjectColor } from "@components/project/Creates/palettes"
import Middle from "@components/project/common/Middle"
import TitleInput from "@components/project/common/TitleInput"
import EditBox from "@components/project/edit/EditBox"

import { patchProject } from "@api/projects.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ProjectEdit = ({ project }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const theme = useTheme()
    const inputRef = useRef(null)

    const [name, setName] = useState(project.name)

    useEffect(() => {
        setName(project.name)
    }, [project])

    const { closeModal } = useModalWindowCloseContext()

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchProject(project.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects", project.id],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            })
        },
        onError: () => {
            toast.error(t("edit.project_change_error"))
        },
    })

    const items = useMemo(
        () => makeItems(t, theme, project, patchMutation.mutate),
        [t, theme, project, patchMutation],
    )

    return (
        <EditBox>
            <TitleInput
                name={name}
                setName={setName}
                setFunc={patchMutation.mutate}
                inputRef={inputRef}
                isCreate={false}
                icon="archive"
                onClose={closeModal}
            />
            <Middle items={items} isCreate={false} />
        </EditBox>
    )
}

const makeItems = (t, theme, project, setFunc) => [
    {
        id: 1,
        icon: "circle",
        color: getProjectColor(theme.type, project.color),
        display: t("color." + project.color),
        component: <Color setColor={setFunc} />,
    },
    {
        id: 2,
        icon: "server",
        display: t("privacy." + project.privacy),
        component: <Privacy setPrivacy={setFunc} />,
    },
    {
        id: 3,
        icon: "award",
        display: t("type." + project.type),
        component: <Type setType={setFunc} />,
    },
]

export default ProjectEdit
