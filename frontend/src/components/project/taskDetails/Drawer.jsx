import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Detail from "@components/project/common/Detail"
import DrawerFolder from "@components/project/taskDetails/DrawerFolder"

import { getProjectList } from "@api/projects.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Drawer = ({ setFunc, onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.drawer" })

    const {
        isPending,
        isError,
        data: projects,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjectList(),
    })

    const changeDrawer = (drawerID, drawerName, projectID, projectName) => {
        return () => {
            setFunc({
                drawer: drawerID,
                drawer_name: drawerName,
                project_id: projectID,
                project_name: projectName,
            })
            onClose()
        }
    }

    if (isPending) {
        return <Detail title={t("title")}/>
    }

    if (isError) {
        return (
            <DrawerSettingLoadErrorBox>
                <FeatherIcon icon="alert-triangle" />
                {t("fetching_error")}
            </DrawerSettingLoadErrorBox>
        )
    }
        
    return (
        projects?.map((project) => (
            <DrawerFolder
                key={project.id}
                project={project}
                changeDrawer={changeDrawer}
            />
        ))
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

export default Drawer
