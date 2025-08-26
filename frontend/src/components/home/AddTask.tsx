import { Suspense, lazy, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import ModalLoader from "@components/common/ModalLoader"
import Module, { Title } from "@components/home/Module"

import { getDrawer } from "@api/drawers.api"

import PlusCircle from "@assets/home/PlusCircle"

import { useTranslation } from "react-i18next"

const TaskCreateElement = lazy(
    () => import("@components/project/taskDetails/TaskCreateElement"),
)

const AddTask = () => {
    const { t } = useTranslation("home", { keyPrefix: "add_task" })
    const [isOpen, setOpen] = useState(false)

    const onClick = () => {
        setOpen(true)
    }

    const inboxQuery = useQuery({
        queryKey: ["projects", "inbox"],
        async queryFn() {
            return getDrawer("inbox")
        },
        refetchOnWindowFocus: false,
    })

    return (
        <Module>
            <Title>{t("title")}</Title>
            <ButtonOpen onClick={onClick} $error={inboxQuery.isError}>
                <div>{t(inboxQuery.isError ? "error" : "tap_to_open")}</div>
                <PlusCircle />
            </ButtonOpen>
            {isOpen && inboxQuery.isLoading && <ModalLoader />}
            {isOpen && inboxQuery.isSuccess && (
                <Suspense key="task-create-drawer" fallback={<ModalLoader />}>
                    <TaskCreateElement
                        drawer={inboxQuery.data}
                        onClose={() => setOpen(false)}
                    />
                </Suspense>
            )}
        </Module>
    )
}

const ButtonOpen = styled(MildButton)<{ $error: boolean }>`
    background-color: ${(p) =>
        p.$error
            ? p.theme.primaryColors.danger
            : p.theme.accentBackgroundColor};
    color: ${(p) => (p.$error ? p.theme.white : p.theme.secondTextColor)};
    width: 100%;
    padding: 0.5em 0.75em;
    border-radius: 16px;
    text-align: left;
    font-size: 1em;

    display: flex;
    justify-content: space-between;
    align-items: center;

    & svg {
        top: 0;
        margin-right: 0;
    }
`

export default AddTask
