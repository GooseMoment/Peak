import { useEffect, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import ConfirmationSignOut from "@components/sidebar/ConfirmationSignOut"
import SidebarLink, { SidebarLinkLazy } from "@components/sidebar/SidebarLink"

import { getMe } from "@api/users.api"

import useScreenType from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Footer = ({ collapsed, closeSidebar }) => {
    const {
        data: user,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
    })

    const { t } = useTranslation(null, { keyPrefix: "sidebar" })

    const { isMobile } = useScreenType()

    useEffect(() => {
        if (isError) {
            toast.error(t("user_error"), {
                toastId: "sidebar_footer_user_load_error",
            })
        }
    }, [isError])

    const onClickLink = () => {
        if (isMobile) {
            closeSidebar()
        }
    }

    const [isSignOutConfirmationOpen, setSignOutConfirmationOpen] =
        useState(false)

    const openSignOutConfirmation = (e) => {
        e.preventDefault()
        setSignOutConfirmationOpen(true)
    }

    return (
        <FooterBox $collapsed={collapsed}>
            {isPending && (
                <MeProfile>
                    <MeProfileImgSkeleton />
                    {!collapsed && <UsernameSkeleton />}
                </MeProfile>
            )}

            {isError && <MeProfile />}

            {user && (
                <SidebarLinkLazy
                    to={`users/@${user.username}`}
                    onClick={onClickLink}
                    draggable="false"
                >
                    <MeProfile>
                        <MeProfileImg src={user.profile_img} />
                        {!collapsed && <Username>{user.username}</Username>}
                    </MeProfile>
                </SidebarLinkLazy>
            )}

            {!collapsed && (
                <SmallIcons>
                    <SidebarLinkLazy
                        navigateTo="/app/settings/account"
                        to="/app/settings"
                        draggable="false"
                        end={false}
                        onClick={onClickLink}
                        key="settings"
                    >
                        <SmallIcon>
                            <FeatherIcon icon="settings" />
                        </SmallIcon>
                    </SidebarLinkLazy>
                    <SidebarLink
                        to="/app/sign_out"
                        draggable="false"
                        onClick={openSignOutConfirmation}
                        key="sign-out"
                    >
                        <SmallIcon>
                            <FeatherIcon icon="log-out" />
                        </SmallIcon>
                        {isSignOutConfirmationOpen && (
                            <ConfirmationSignOut
                                onClose={() =>
                                    setSignOutConfirmationOpen(false)
                                }
                            />
                        )}
                    </SidebarLink>
                </SmallIcons>
            )}
        </FooterBox>
    )
}

const FooterBox = styled.footer`
    display: flex;
    flex-direction: ${(props) => (props.$collapsed ? "column" : "row")};
    justify-content: space-between;

    margin: 1em;
`

const MeProfile = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;

    padding: 0.5em;
    background-color: inherit;
    border-radius: 10px;
`

const profileImgStyle = css`
    border-radius: 50%;
    aspect-ratio: 1/1;
    height: 2em;
`

const MeProfileImg = styled.img`
    ${profileImgStyle}
`

const MeProfileImgSkeleton = styled.div`
    ${profileImgStyle}

    ${skeletonCSS("-50px", "170px")}
`

const Username = styled.span`
    font-weight: 500;
`

const UsernameSkeleton = styled.div`
    width: 5em;
    height: 1.75em;

    ${skeletonCSS("-170px", "100px")}
`

const SmallIcons = styled.div`
    display: flex;
    align-items: center;

    gap: 0.25em;
`

const SmallIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0.5em;
    margin: 0.35em;

    width: auto;

    & svg {
        margin-right: 0;
        width: auto;
        height: 1.25em;
    }
`

export default Footer
