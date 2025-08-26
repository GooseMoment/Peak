import { Suspense, lazy, useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import ModalLoader from "@components/common/ModalLoader"
import PageTitle from "@components/common/PageTitle"
import InboxDrawer from "@components/drawers/InboxDrawer"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import { SkeletonInboxPage } from "@components/project/skeletons/SkeletonProjectPage"
import SortIcon from "@components/project/sorts/SortIcon"
import SortMenu from "@components/project/sorts/SortMenu"

import { getDrawer } from "@api/drawers.api"

import { ifMobile } from "@utils/useScreenType"
import useScreenType from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const SortMenuMobile = lazy(
    () => import("@components/project/sorts/SortMenuMobile"),
)
const TaskCreateElement = lazy(
    () => import("@components/project/taskDetails/TaskCreateElement"),
)

const InboxPage = () => {
    const theme = useTheme()
    const { isMobile } = useScreenType()

    const [ordering, setOrdering] = useState("order")
    const [isSortMenuMobileOpen, setSortMenuMobileOpen] = useState(false)
    const [isCreateOpen, setCreateOpen] = useState(false)

    const { t } = useTranslation("translation", { keyPrefix: "project" })

    const sortMenuItems = useMemo(() => makeSortMenuItems(t), [t])

    const { isLoading, isError, data, refetch } = useQuery({
        queryKey: ["inbox"],
        async queryFn() {
            return getDrawer("inbox")
        },
    })

    const openInboxTaskCreate = () => {
        setCreateOpen(true)
    }

    const onClickProjectErrorBox = () => {
        refetch()
    }

    if (isLoading) {
        return <SkeletonInboxPage />
    }

    if (isError) {
        return (
            <ErrorBox onClick={onClickProjectErrorBox}>
                <FeatherIcon icon="alert-triangle" />
                {t("error_load_inbox")}
            </ErrorBox>
        )
    }

    const color = theme.grey

    return (
        <>
            <TitleBox>
                <PageTitleBox>
                    <PageTitle $color={color}>{t("inbox")}</PageTitle>
                    <PrivacyIcon privacy="private" color={color} isProject />
                </PageTitleBox>
                <Icons>
                    <FeatherIcon icon="plus" onClick={openInboxTaskCreate} />
                    <SortIconBox>
                        {isMobile ? (
                            <div onClick={() => setSortMenuMobileOpen(true)}>
                                <SortIcon color={theme.textColor} />
                            </div>
                        ) : (
                            <SortMenu
                                color={theme.textColor}
                                items={sortMenuItems}
                                ordering={ordering}
                                setOrdering={setOrdering}
                            />
                        )}
                    </SortIconBox>
                </Icons>
            </TitleBox>
            {data && (
                <InboxDrawer
                    drawer={data}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            )}
            {isSortMenuMobileOpen && (
                <Suspense
                    key="sort-menu-mobile-inbox-page"
                    fallback={<ModalLoader />}>
                    <SortMenuMobile
                        title={t("sort.task_title")}
                        items={sortMenuItems}
                        onClose={() => setSortMenuMobileOpen(false)}
                        ordering={ordering}
                        setOrdering={setOrdering}
                    />
                </Suspense>
            )}
            {data && isCreateOpen && (
                <Suspense
                    key="task-create-inbox-page"
                    fallback={<ModalLoader />}>
                    <TaskCreateElement
                        drawer={data}
                        onClose={() => setCreateOpen(false)}
                    />
                </Suspense>
            )}
        </>
    )
}

const TitleBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const PageTitleBox = styled.div`
    display: flex;
    align-items: center;
`

const Icons = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;
    margin-right: 1em;

    & svg {
        cursor: pointer;
    }

    ${ifMobile} {
        margin-right: 0;
        gap: 0.5em;
    }
`

const SortIconBox = styled.div`
    & svg {
        position: relative;
        top: 0.17em;
        margin-right: 0.5em;
    }
`

const makeSortMenuItems = (t: TFunction<"translation", "project">) => [
    { display: t("sort.-priority"), context: "-priority" },
    { display: t("sort.due_date"), context: "due_date" },
    {
        display: t("sort.-due_date"),
        context: "-due_date",
    },
    { display: t("sort.name"), context: "name" },
    { display: t("sort.-name"), context: "-name" },
    { display: t("sort.created_at"), context: "created_at" },
    { display: t("sort.-created_at"), context: "-created_at" },
    { display: t("sort.reminders"), context: "reminders" },
]

export default InboxPage
