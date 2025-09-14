import { Dispatch, SetStateAction } from "react"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Detail from "@components/project/common/Detail"
import DrawerFolder from "@components/project/taskDetails/DrawerFolder"

import { type Drawer, getAllDrawers } from "@api/drawers.api"
import { type MinimalTask } from "@api/tasks.api"

import { PaletteColorName } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const TaskDetailDrawer = ({
    setFunc,
    onClose,
    setNewColor,
}: {
    setFunc: (diff: Partial<MinimalTask>) => void
    onClose: () => void
    setNewColor?: Dispatch<SetStateAction<PaletteColorName>>
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.drawer" })

    const {
        data: drawers,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["drawers"],
        queryFn: () => getAllDrawers(),
    })

    const changeDrawer = (drawer: Drawer) => {
        return () => {
            setFunc({
                drawer: drawer,
            })
            onClose()

            if (setNewColor === undefined) return
            setNewColor(drawer.project.color)
        }
    }

    if (isPending) {
        return <Detail title={t("title")} />
    }

    if (isError) {
        return (
            <DrawerSettingLoadErrorBox onClick={() => refetch()}>
                <FeatherIcon icon="alert-triangle" />
                {t("fetching_error")}
            </DrawerSettingLoadErrorBox>
        )
    }

    const grouped: Record<string, Drawer[]> = {}

    for (const drawer of drawers) {
        const pname = drawer.project.name
        if (!grouped[pname]) {
            grouped[pname] = []
        }
        grouped[pname].push(drawer)
    }

    return (
        <>
            {Object.entries(grouped).map(([projectName, projectDrawers]) => (
                <DrawerFolder
                    key={projectName}
                    drawers={projectDrawers}
                    changeDrawer={changeDrawer}
                />
            ))}
        </>
    )
}

const DrawerSettingLoadErrorBox = styled.div`
    display: flex;
    align-items: center;
    height: 2.5em;
    margin: 1em;
    margin-bottom: 0em;
    border-radius: 15px;
    padding: 0.5em;
    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.primaryColors.danger};

    & svg {
        top: 0;
        width: 2em;
        height: 2em;
        margin: 0em 1em;
        color: ${(p) => p.theme.white};
    }
`

export default TaskDetailDrawer
