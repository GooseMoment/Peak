import { Dispatch, SetStateAction } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import Detail from "@components/project/common/Detail"
import DrawerFolder from "@components/project/taskDetails/DrawerFolder"

import { type Drawer, getAllDrawers } from "@api/drawers.api"
import { type MinimalTask } from "@api/tasks.api"

import { getPageFromURL } from "@utils/pagination"

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
    setNewColor: Dispatch<SetStateAction<PaletteColorName>>
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.drawer" })

    const {
        data: drawers,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["drawers"],
        queryFn: (context) => getAllDrawers(context.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage = drawers?.pages[drawers?.pages?.length - 1].next !== null

    const changeDrawer = (drawer: Drawer) => {
        return () => {
            setFunc({
                drawer: drawer,
            })
            setNewColor(drawer.project.color)
            onClose()
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

    return (
        <div>
            <DrawerFolder drawers={drawers} changeDrawer={changeDrawer} />

            {hasNextPage ? (
                <ButtonGroup $justifyContent="center" $margin="1em">
                    <MoreButton
                        disabled={isFetchingNextPage}
                        loading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}>
                        {isPending ? t("loading") : t("button_load_more")}
                    </MoreButton>
                </ButtonGroup>
            ) : null}
        </div>
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

const MoreButton = styled(Button)`
    width: 80%;
`

export default TaskDetailDrawer
