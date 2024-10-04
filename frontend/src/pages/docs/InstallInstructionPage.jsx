import styled from "styled-components"

import PageBack from "@components/common/PageBack"
import PageDescription from "@components/common/PageDescription"
import PageTitle from "@components/common/PageTitle"

import FeatherIcon from "feather-icons-react"
import { Trans, useTranslation } from "react-i18next"

const InstallInstructionPage = () => {
    const { t } = useTranslation("docs", {
        keyPrefix: "install_instruction_ios",
    })

    return (
        <Page>
            <PageBack defaultTo="/app/home">{t("back")}</PageBack>
            <PageTitle>{t("title")}</PageTitle>
            <PageDescription>{t("description")}</PageDescription>
            <Blank />
            <SectionNumber>{t("step1")}</SectionNumber>
            <Card>
                <BrowserIcon draggable="false" src="/images/safari.webp" />
                <CardText>{t("open_safari")}</CardText>
            </Card>
            <Card>
                <SafariAddressBar>
                    <div>alpha.peak.ooo</div>
                    <AddressBarIcons>
                        <FeatherIcon icon="mic" />
                        <FeatherIcon icon="x-circle" />
                    </AddressBarIcons>
                </SafariAddressBar>
                <CardText>
                    {t("go_to_website", { site: "alpha.peak.ooo" })}{" "}
                </CardText>
            </Card>
            <SectionNumber>{t("step2")}</SectionNumber>
            <Card>
                <SafariWrapper>
                    <SafariAddressBar>
                        <div />
                        <div>
                            <FeatherIcon icon="lock" />
                            alpha.peak.ooo
                        </div>
                        <AddressBarIcons>
                            <FeatherIcon icon="rotate-cw" />
                        </AddressBarIcons>
                    </SafariAddressBar>
                    <ShareIcon icon="share" />
                </SafariWrapper>
                <CardText>
                    <Trans
                        t={t}
                        i18nKey="press_share"
                        components={{ Icon: <FeatherIcon icon="share" /> }}
                    />
                </CardText>
            </Card>
            <Card>
                <SafariShareMenuItem>
                    <div>{t("menu_add_to_homescreen")}</div> <div></div>
                </SafariShareMenuItem>
                <CardText>{t("select_add_to_homescreen")}</CardText>
            </Card>
        </Page>
    )
}

const Page = styled.div`
    min-height: 100dvh;
    max-width: 100dvw;
    padding-top: max(env(safe-area-inset-top), 2rem);
    padding-right: max(env(safe-area-inset-right), 1.5rem);
    padding-bottom: calc(2rem + 6rem);
    padding-left: max(env(safe-area-inset-left), 1.5rem);
`

const Blank = styled.div`
    margin-bottom: 2.5em;
`

const SectionNumber = styled.h2`
    font-weight: 700;
    margin-top: 1em;
`

const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5em;

    margin: 1em 0;
    padding: 1em;

    border-radius: 16px;
    background-color: ${(p) => p.theme.thirdBackgroundColor};
`

const CardText = styled.div`
    font-weight: 500;
    & svg {
        margin-right: 0;
    }
`

const BrowserIcon = styled.img`
    aspect-ratio: 1/1;
    border-radius: 15px;
    height: 5em;
    width: 5em;

    user-select: none;
    -webkit-user-select: none;
`

const SafariAddressBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: 14px;
    max-width: 20em;
    min-width: 15em;
    background-color: ${(p) => p.theme.backgroundColor};
    padding: 1em 0.75em;

    box-shadow: 0px 10px 15px ${(p) => p.theme.help.addressBarShadowColor};
`

const SafariWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1.5em;

    background-color: ${(p) => p.theme.backgroundColor};
    border-radius: 16px;
    padding: 0.5em 1em 1em;
`

const AddressBarIcons = styled.div`
    display: flex;
    gap: 1em;

    & svg {
        stroke: ${(p) => p.theme.secondTextColor};
        margin: 0;
    }

    & .feather-mic > g:nth-child(1) > path:nth-child(1) {
        fill: ${(p) => p.theme.secondTextColor};
    }

    & .feather-x-circle {
        stroke: ${(p) => p.theme.backgroundColor};

        & > g > circle {
            fill: ${(p) => p.theme.secondTextColor};
        }
    }
`

const ShareIcon = styled(FeatherIcon)`
    height: 1.5em;
    width: 1.5em;
    color: ${(p) => p.theme.primaryColors.link};
`

const SafariShareMenuItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;

    width: 15em;

    background-color: ${(p) => p.theme.backgroundColor};
    padding: 1em;

    user-select: none;
    -webkit-user-select: none;
`

export default InstallInstructionPage
