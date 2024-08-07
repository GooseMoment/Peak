import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import DrawerFolder from "@components/project/Creates/DrawerFolder"
import Detail from "@components/project/common/Detail"

import { getProjectList } from "@api/projects.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Drawer = ({ setFunc, closeComponent }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.drawer" })

    const {
        isPending,
        isError,
        data: projects,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjectList(),
    })

    const changeDrawer = (drawerId) => {
        return async () => {
            setFunc({ drawer: drawerId })
            closeComponent()
        }
    }

    if (isPending) {
        return <Detail title={t("title")} onClose={closeComponent} />
    }

    return (
        <Detail title={t("title")} onClose={closeComponent}>
            {isError && (
                <DrawerSettingLoadErrorBox>
                    <FeatherIcon icon="alert-triangle" />
                    {t("fetching_error")}
                </DrawerSettingLoadErrorBox>
            )}
            {projects?.map((project) => (
                <DrawerFolder
                    key={project.id}
                    project={project}
                    changeDrawer={changeDrawer}
                />
            ))}
        </Detail>
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
