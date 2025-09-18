import { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { LoaderCircleBold } from "@components/common/LoaderCircle"
import TaskBox from "@components/social/logDetails/TaskBox"
import FollowButton from "@components/users/FollowButton"
import Requests from "@components/users/Requests"

import {
    Notification,
    getNotification,
    getRelatedUserFromNotification,
} from "@api/notifications.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import useModal, { Portal } from "@utils/useModal"

import { DateTime } from "luxon"

export default function NotificationPage() {
    const navigate = useNavigate()
    const modal = useModal({
        afterClose() {
            navigate("/app/notifications")
        },
    })
    const { id } = useParams<{ id: Notification["id"] }>()
    useEffect(() => {
        if (id) {
            modal.openModal()
        }
    }, [id])

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

    const dateLocaleString = useMemo(() => {
        if (!data) {
            return ""
        }

        return DateTime.fromISO(data.created_at, { zone: tz }).toLocaleString(
            DateTime.DATETIME_MED,
            {
                locale,
            },
        )
    }, [data, locale, tz])

    if (isPending || !relatedUser) {
        return (
            <Frame>
                <LoaderCircleBold />
            </Frame>
        )
    }

    if (isError) {
        return <Frame>알 수 없는 알림입니다.</Frame>
    }

    return (
        <Frame>
            <Header to={`/app/users/@${relatedUser.username}`}>
                <ProfileImg src={relatedUser.profile_img} />
                <Names>
                    <DisplayName>{relatedUser.display_name}</DisplayName>
                    <Username>@{relatedUser.username}</Username>
                </Names>
            </Header>
            <Time dateTime={data.created_at}>{dateLocaleString}</Time>
            <Body>
                {data.type === "task_reaction" && "내 작업에 반응했습니다."}
                {data.type === "follow_request" &&
                    "내게 팔로우 요청을 보냈습니다."}
                {data.type === "follow_request_accepted" &&
                    "내 팔로우 요청을 수락했습니다."}
                {data.type === "follow" && "나를 팔로우하기 시작했습니다."}
                {data.type === "peck" && "내 작업을 쪼았습니다."}
            </Body>
            {(data.type === "follow" ||
                data.type === "follow_request" ||
                data.type === "follow_request_accepted") && (
                <FollowButton username={relatedUser.username} />
            )}
            {data.type === "follow_request" && <Requests user={relatedUser} />}
            {data.type === "peck" && (
                <TaskBox task={data.peck.task} isFollowingPage color="black" />
            )}
            {data.type === "task_reaction" && (
                <TaskBox
                    task={data.task_reaction.task}
                    isFollowingPage
                    color="black"
                />
            )}
        </Frame>
    )
}

const Frame = styled.div`
    background-color: ${(p) => p.theme.backgroundColor};
    width: 400px;
    height: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const Header = styled(Link)`
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

const Names = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25em;
`

const DisplayName = styled.span`
    font-weight: 600;
    font-size: 1.1em;
`

const Username = styled.span`
    font-size: 0.9em;
`

const Body = styled.div``

const Time = styled.time`
    font-size: 0.9em;
`
