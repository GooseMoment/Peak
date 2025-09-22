import { useEffect, useMemo, useRef, useState } from "react"

import styled from "styled-components"

import { DemoRecord } from "@components/intro/DemoRecord"
import SubSection from "@components/intro/SubSection"
import { today } from "@components/intro/todays"
import { DailyUserProfile } from "@components/social/DailyUserProfileContainer"
import { RemarkBox } from "@components/social/RemarkContainer"
import { StatBox } from "@components/social/StatContainer"

import type { Drawer } from "@api/drawers.api"
import type { Project } from "@api/projects.api"
import type { Remark, Stat } from "@api/social.api"
import type { Task } from "@api/tasks.api"
import type { User } from "@api/users.api"

import { ifMobile } from "@utils/useScreenType"

import { PaletteColorName, palettes } from "@assets/palettes"

import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const DemoShare = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_share.demo_share",
    })

    const [selected, setSelected] = useState("alpaca")
    const users = useMemo(() => makeDemoUsers(t), [t])
    const userIndex = useMemo(() => {
        return users.map((user) => user.username).indexOf(selected)
    }, [selected, users])
    const stats = useMemo(() => makeStats(users), [users])
    const remarks = useMemo(() => makeRemarks(t, users), [t, users])
    const records = useMemo(() => makeRecords(t, users), [t, users])

    const recordDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (userIndex === 0) return
        recordDivRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [userIndex])

    return (
        <SubSectionFlex>
            <Container>
                {stats.map((stat, index) => (
                    <StatBox
                        key={stat.username}
                        stat={stat}
                        isSelected={stat.username === selected}
                        setSelectedUser={setSelected}
                        mine={index === 0}
                        demo
                    />
                ))}
            </Container>
            <RecordSectionWrapper ref={recordDivRef}>
                <DailyUserProfile
                    username={users[userIndex].username}
                    displayName={users[userIndex].display_name}
                    profileImg={users[userIndex].profile_img}
                    noLink
                />
                <RemarkBox remark={remarks[userIndex]} />
                <DemoRecord record={records[userIndex] || []} />
            </RecordSectionWrapper>
        </SubSectionFlex>
    )
}

function makeDemoUsers(
    t: TFunction<"intro", "section_share.demo_share">,
): User[] {
    return [
        {
            username: "alpaca",
            display_name: t("users.0"),
            followings_count: 123,
            followers_count: 456,
            bio: "",
            email: "",
            header_color: "blue",
            is_me: false,
            profile_img: "https://alpha-media.peak.ooo/static/alpaca.jpg",
        },
        {
            username: "quokka",
            display_name: t("users.1"),
            followings_count: 234,
            followers_count: 567,
            bio: "",
            email: "",
            header_color: "magenta",
            is_me: false,
            profile_img: "https://alpha-media.peak.ooo/static/quokka.jpeg",
        },
        {
            username: "sloth",
            display_name: t("users.2"),
            followings_count: 345,
            followers_count: 678,
            bio: "",
            email: "",
            header_color: "mint",
            is_me: false,
            profile_img: "https://alpha-media.peak.ooo/static/sloth.jpeg",
        },
        {
            username: "golden",
            display_name: t("users.3"),
            followings_count: 456,
            followers_count: 789,
            bio: "",
            email: "",
            header_color: "orange",
            is_me: false,
            profile_img:
                "https://alpha-media.peak.ooo/static/golden-retriever.jpeg",
        },
        {
            username: "hamster",
            display_name: t("users.4"),
            followings_count: 567,
            followers_count: 890,
            bio: "",
            email: "",
            header_color: "deep_blue",
            is_me: false,
            profile_img: "https://alpha-media.peak.ooo/static/hamster.jpeg",
        },
    ]
}

function makeStats(users: User[]): Stat[] {
    return users.map((user, index) => ({
        ...user,
        completed_task_count: (index + 1) * 10 + user.username.length,
        reaction_count: (index + 1) * 10 + user.display_name.length,
        date: today,
    }))
}

function makeRemarks(
    t: TFunction<"intro", "section_share.demo_share">,
    users: User[],
): Remark[] {
    return ([0, 1, 2, 3, 4] as const).map((uidx) => {
        return {
            id: `remark-${users[uidx].username}`,
            user: users[uidx],
            content: t(`records.${uidx}.remark`),
            date: today,
            created_at: today,
            updated_at: today,
            deleted_at: null,
        }
    })
}

function newMockProject(override: Partial<Project> = {}): Project {
    return Object.assign(
        {
            name: "PROJECT",
            color: "red",
            id: "project1",
            privacy: "public",
            order: 1,
            uncompleted_task_count: 0,
            completed_task_count: 0,
            type: "regular",
        } as Project,
        override,
    )
}

function newMockDrawer(
    name: string,
    user: User,
    color: PaletteColorName,
): Drawer {
    return {
        name,
        id: "demo-drawer",
        order: 1,
        privacy: "public",
        uncompleted_task_count: 0,
        completed_task_count: 0,
        user,
        project: newMockProject({ user, color }),
    } as Drawer
}

function makeRecords(
    t: TFunction<"intro", "section_share.demo_share">,
    users: User[],
): Task[][] {
    const userIndexes = [0, 1, 2, 3, 4] as const
    const taskIndexes = [0, 1, 2] as const

    const mockDate = new Date().toISOString()

    const records: Task[][] = []
    for (const uidx of userIndexes) {
        const user = users[uidx]
        const userRecords: Task[] = []
        for (const tidx of taskIndexes) {
            userRecords.push({
                id: `demo-${uidx}-${tidx}`,
                name: t(`records.${uidx}.tasks.${tidx}`),
                drawer: newMockDrawer(
                    t(`records.${uidx}.drawers.${tidx}`),
                    user,
                    palettes.palette1[
                        Math.floor(Math.random() * palettes.palette1.length)
                    ],
                ),
                user,
                priority: (tidx + uidx + user.username.length) % 3,
                completed_at: (tidx + uidx) % 2 === 0 ? mockDate : null,
                // fields below are not required for demo purposes
                // however, ommitting them may cause future issues
                privacy: "public",
                order: 1,
                due_type: null,
                due_date: null,
                due_datetime: null,
                memo: "",
                assigned_at: null,
                reminders: [],
                created_at: mockDate,
                updated_at: mockDate,
                deleted_at: null,
            })
        }
        records.push(userRecords)
    }

    return records
}

const SubSectionFlex = styled(SubSection)`
    display: flex;
    flex-wrap: nowrap;
    justify-content: stretch;
    gap: 2em 4em;

    ${ifMobile} {
        flex-wrap: wrap;
    }
`

const Container = styled.div`
    width: 100%;
    max-width: 25rem;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 1em;
`

const RecordSectionWrapper = styled.div`
    scroll-margin-top: 8em;

    width: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 1.5em;
`

export default DemoShare
