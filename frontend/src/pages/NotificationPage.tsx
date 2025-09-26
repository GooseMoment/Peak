import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { LoaderCircleBold } from "@components/common/LoaderCircle"
import MildButton from "@components/common/MildButton"
import NotificationBody from "@components/notifications/NotificationBody"

import {
    Notification,
    getNotification,
    getRelatedUserFromNotification,
} from "@api/notifications.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import useModal, { Portal, useModalContext } from "@utils/useModal"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

export default function NotificationPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: Notification["id"] }>()
    const modal = useModal({
        initiallyOpen: !!id,
        afterClose() {
            navigate("/app/notifications")
        },
    })

    if (!id) {
        return null
    }

    return (
        <Portal modal={modal}>
            <NotificationPageInner id={id} />
        </Portal>
    )
}

function NotificationPageInner({ id }: { id: Notification["id"] }) {
    const tz = useClientTimezone()
    const locale = useClientLocale()
    const modal = useModalContext()
    const { t } = useTranslation("translation")
    const { data, isPending, isError } = useQuery({
        queryKey: ["notifications", id],
        queryFn: () => getNotification(id!),
        enabled: !!id,
    })

    const relatedUser = useMemo(() => {
        if (!data) {
            return undefined
        }

        return getRelatedUserFromNotification(data)
    }, [data])

    const [dateLocale, dateRelative] = useMemo<[string, string | null]>(() => {
        if (!data) {
            return ["", null]
        }

        const date = DateTime.fromISO(data.created_at, { zone: tz }).setLocale(
            locale,
        )
        return [
            date.toLocaleString(DateTime.DATETIME_MED),
            date.toRelative({ style: "narrow" }),
        ]
    }, [data, locale, tz])

    if (isPending || (data?.type !== "task_reminder" && !relatedUser)) {
        return (
            <Frame>
                <LoaderCircleBold />
            </Frame>
        )
    }

    if (isError) {
        return (
            <Frame>
                {modal && (
                    <CloseButton onClick={() => modal.closeModal()}>
                        <FeatherIcon icon="x" />
                    </CloseButton>
                )}
                {t("common.error_load")}
            </Frame>
        )
    }

    return (
        <Frame>
            {modal && (
                <CloseButton onClick={() => modal.closeModal()}>
                    <FeatherIcon icon="x" />
                </CloseButton>
            )}
            {relatedUser && (
                <Header>
                    <Link to={`/app/users/@${relatedUser.username}`}>
                        <ProfileImg src={relatedUser.profile_img} />
                    </Link>
                    <Texts>
                        <Username to={`/app/users/@${relatedUser.username}`}>
                            @{relatedUser.username}
                        </Username>
                        <Time
                            dateTime={data.created_at}
                            title={data.created_at}>
                            {dateLocale} ({dateRelative})
                        </Time>
                    </Texts>
                </Header>
            )}
            {!relatedUser && data.type === "task_reminder" && (
                <Header>
                    <Texts>
                        <TaskReminderTaskName>
                            {data.task_reminder.task_name}
                        </TaskReminderTaskName>
                        <Time
                            dateTime={data.created_at}
                            title={data.created_at}>
                            {dateLocale} ({dateRelative})
                        </Time>
                    </Texts>
                </Header>
            )}
            <NotificationBody notification={data} />
        </Frame>
    )
}

const Frame = styled.div`
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};

    position: relative;

    width: 90vw;
    max-width: 500px;
    height: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 0.75em;
`

const CloseButton = styled(MildButton)`
    position: absolute;
    top: -0.25em;
    right: -0.25em;
    padding: 1em;
    font-size: 1.25em;
    cursor: pointer;
    color: ${(p) => p.theme.secondTextColor};

    svg {
        margin-right: 0;
        top: 0;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5em;
`

const ProfileImg = styled.img`
    width: 3em;
    height: 3em;
    border-radius: 50%;
    object-fit: cover;
`

const Texts = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const Username = styled(Link)`
    font-weight: 700;
`

const TaskReminderTaskName = styled.div`
    font-weight: 700;
`

const Time = styled.time`
    font-size: 0.7em;
`
