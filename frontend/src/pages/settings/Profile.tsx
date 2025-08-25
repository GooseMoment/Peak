import { type FormEvent, type MouseEvent, useEffect, useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import Input from "@components/common/Input"
import { LoaderCircleFull } from "@components/common/LoaderCircle"
import MildButton from "@components/common/MildButton"
import ModalWindow from "@components/common/ModalWindow"
import Color from "@components/project/edit/Color"
import ProfileImg from "@components/settings/ProfileImg"
import Section, { Name, Value, ValueError } from "@components/settings/Section"

import { type User, getMe, patchUser } from "@api/users.api"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { type PaletteColorName, getPaletteColor } from "@assets/palettes"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Profile = () => {
    const { t } = useTranslation("settings", { keyPrefix: "profile" })
    const theme = useTheme()

    const { isDesktop } = useScreenType()

    const {
        data: user,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["users", "me"],
        queryFn: getMe,
    })

    const [headerColor, setHeaderColor] = useState<{ color: PaletteColorName }>(
        {
            color: "grey",
        },
    )
    const [paletteOpen, setPaletteOpen] = useState(false)

    const mutation = useMutation({
        mutationFn: (data: Partial<User>) => {
            return patchUser(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "me"] })
            queryClient.invalidateQueries({
                queryKey: ["users", user?.username],
            })
            toast.success(t("profile_edited"))
        },
        onError: () => {
            toast.error(t("profile_fail"))
        },
    })

    useEffect(() => {
        if (user) {
            setHeaderColor({ color: user.header_color })
        }
    }, [user])

    const onClickOpenPalette = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setPaletteOpen(true)
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const fd = new FormData(form)

        const payload: Partial<User> = {}

        const displayName = fd.get("display_name")
        if (typeof displayName === "string") payload.display_name = displayName

        const bio = fd.get("bio")
        if (typeof bio === "string") payload.bio = bio

        const headerColor = fd.get("header_color")
        if (
            typeof headerColor === "string" &&
            getPaletteColor(theme.type, headerColor as PaletteColorName)
        )
            payload.header_color = headerColor as PaletteColorName

        mutation.mutate(payload)
    }

    if (isPending) {
        return <LoaderCircleFull />
    }

    if (isError) {
        return (
            <Section>
                <ValueError onClickRetry={refetch} />
            </Section>
        )
    }

    return (
        <>
            <Section>
                <ImgNameEmailContainer>
                    <ProfileImg
                        profile_img={user.profile_img}
                        username={user.username}
                    />
                    <NameEmail>
                        <Username title={"@" + user.username}>
                            @{user.username}
                        </Username>
                        <Email title={user.email}>{user.email}</Email>
                    </NameEmail>
                </ImgNameEmailContainer>
            </Section>
            <form onSubmit={onSubmit}>
                <Section>
                    <Name>{t("display_name")}</Name>
                    <Value>
                        <Input
                            name="display_name"
                            type="text"
                            maxLength={18}
                            defaultValue={user.display_name}
                            placeholder={t("display_name_placeholder")}
                            $width={isDesktop ? "30em" : "100%"}
                        />
                    </Value>
                </Section>
                <Section>
                    <Name>{t("bio")}</Name>
                    <Value>
                        <Bio
                            autoComplete="off"
                            name="bio"
                            maxLength={150}
                            defaultValue={user.bio}
                            placeholder={t("bio_placeholder")}
                        />
                    </Value>
                </Section>
                <Section>
                    <Name>{t("header_color")}</Name>
                    <Value>
                        <ColorButton
                            onClick={onClickOpenPalette}
                            $color={getPaletteColor(
                                theme.type,
                                headerColor.color,
                            )}
                        />
                        <input
                            name="header_color"
                            type="hidden"
                            value={headerColor.color || ""}
                        />
                    </Value>
                    {paletteOpen && (
                        <ModalWindow afterClose={() => setPaletteOpen(false)}>
                            <Color setColor={setHeaderColor} />
                        </ModalWindow>
                    )}
                </Section>
                <Section>
                    <ButtonGroup $justifyContent="right">
                        <Button
                            disabled={mutation.isPending}
                            loading={mutation.isPending}
                            type="submit">
                            {t("button_submit")}
                        </Button>
                    </ButtonGroup>
                </Section>
            </form>
        </>
    )
}

const ImgNameEmailContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 2.5em;
    min-width: 0;

    ${ifMobile} {
        gap: 1.5em;
    }
`

const NameEmail = styled.div`
    position: relative;
    display: flex;
    gap: 1em;
    flex-direction: column;
    min-width: 0;
`

const Username = styled.div`
    font-weight: 600;
    font-size: 1.25em;

    min-width: 0;
    white-space: nowrap;
    overflow-x: clip;
    text-overflow: ellipsis;
`

const Email = styled.div`
    min-width: 0;
    white-space: nowrap;
    overflow-x: clip;
    text-overflow: ellipsis;
`

const Bio = styled.textarea`
    height: 7em;
    width: 100%;
    resize: none;
    box-sizing: border-box;
    padding: 1em;
    border: none;
    font-size: 1em;

    border: 1px solid ${(p) => p.theme.textColor};
    border-radius: 10px;

    &:focus {
        border-color: ${(p) => p.theme.goose};
    }
`

const ColorButton = styled(MildButton)<{ $color: string }>`
    border-radius: 64px;
    border: 1.5px solid ${(p) => p.theme.secondBackgroundColor};
    aspect-ratio: 3/1;

    height: 2em;

    cursor: pointer;

    background-color: ${(p) => p.$color};
`

export default Profile
