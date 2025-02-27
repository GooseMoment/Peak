import { useEffect } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import { useSidebarContext } from "@components/sidebar/SidebarContext"
import SidebarLink from "@components/sidebar/SidebarLink"

import { getMe } from "@api/users.api"

import { skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Footer = () => {
    const {
        data: user,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
    })

    const { t } = useTranslation(null, { keyPrefix: "sidebar" })

    useEffect(() => {
        if (isError) {
            toast.error(t("user_error"), {
                toastId: "sidebar_footer_user_load_error",
            })
        }
    }, [isError])

    const { isCollapsed } = useSidebarContext()

    return (
        <FooterBox $collapsed={isCollapsed}>
            {isPending && (
                <MeProfile>
                    <MeProfileImgSkeleton />
                    {!isCollapsed && <UsernameSkeleton />}
                </MeProfile>
            )}

            {isError && <MeProfile />}

            {user && (
                <SidebarLink to={`users/@${user.username}`}>
                    <MeProfile>
                        <MeProfileImg src={user.profile_img} />
                        {!isCollapsed && <Username>{user.username}</Username>}
                    </MeProfile>
                </SidebarLink>
            )}

            {!isCollapsed && (
                <SmallIcons>
                    <SidebarLink
                        to="/app/settings/profile"
                        activePath="/app/settings"
                        end={false}
                        key="settings">
                        <SmallIcon>
                            <FeatherIcon icon="settings" />
                        </SmallIcon>
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
