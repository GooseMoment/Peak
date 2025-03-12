import { Link } from "react-router-dom"

import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import DemoCheer from "@components/intro/DemoCheer"
import DemoDrawer from "@components/intro/DemoDrawer"
import DemoPlan from "@components/intro/DemoPlan"
import DemoProject from "@components/intro/DemoProject"
import DemoShare from "@components/intro/DemoShare"
import DemoTheme from "@components/intro/DemoTheme"
import Section, {
    SectionDescription,
    SectionTitle,
} from "@components/intro/Section"
import { SubGroup } from "@components/intro/SubSection"
import Brand from "@components/sign/Brand"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const IntroPage = () => {
    const { t } = useTranslation("intro")

    const goToTop = () => {
        window.scroll({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <>
            <NavContainer>
                <Nav>
                    <Brand />
                    <Link to="/sign/in">
                        <SignInButton>
                            {t("section_top.button_sign_in")}
                        </SignInButton>
                    </Link>
                </Nav>
            </NavContainer>
            <TopHero>
                <TopTitle>
                    {t("section_top.title1")}
                    <br />
                    {t("section_top.title2")}
                </TopTitle>
                <Link to="/sign/up">
                    <TopHeroButton>
                        {t("section_top.button_start")}
                    </TopHeroButton>
                </Link>
            </TopHero>

            <Section>
                <SectionTitle>{t("section_plan.title")}</SectionTitle>
                <SectionDescription>
                    {t("section_plan.description")}
                </SectionDescription>
                <SubGroup>
                    <DemoPlan />
                </SubGroup>
            </Section>

            <Section>
                <SectionTitle>{t("section_organize.title")}</SectionTitle>
                <SectionDescription>
                    {t("section_organize.description")}
                </SectionDescription>
                <SubGroup>
                    <DemoProject />
                    <DemoDrawer />
                </SubGroup>
            </Section>

            <Section>
                <SectionTitle>{t("section_cheer.title")}</SectionTitle>
                <SectionDescription>
                    {t("section_cheer.description")}
                </SectionDescription>
                <SubGroup>
                    <DemoCheer />
                </SubGroup>
            </Section>

            <Section>
                <SectionTitle>{t("section_share.title")}</SectionTitle>
                <SectionDescription>
                    {t("section_share.description")}
                </SectionDescription>
                <SubGroup>
                    <DemoShare />
                </SubGroup>
            </Section>

            <Section>
                <SectionTitle>{t("section_customize.title")}</SectionTitle>
                <SectionDescription>
                    {t("section_customize.description")}
                </SectionDescription>
                <SubGroup>
                    <DemoTheme />
                </SubGroup>
            </Section>

            <Section>
                <ButtonGroup $justifyContent="center" $margin="7em 0">
                    <Button onClick={goToTop}>
                        <NoTopIcon icon="arrow-up-circle" />
                        {t("section_footer.back_to_top")}
                    </Button>
                </ButtonGroup>
            </Section>
        </>
    )
}

const NavContainer = styled.div`
    position: fixed;
    padding: 1.25rem;

    width: 100%;
    box-sizing: border-box;

    z-index: 10;
`

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 0.75rem;

    border-radius: 16px;
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);

    background-color: ${(p) => p.theme.introBackgroundColor};
`

const SignInButton = styled(Button)`
    height: 2em;
`

const TopHero = styled(Section)`
    color: ${(p) => p.theme.introTextColor};
    background-color: ${(p) => p.theme.introBackgroundColor};
    padding-top: 10em;
    padding-bottom: 10em;
`

const TopTitle = styled.h1`
    font-size: 2em;
    font-weight: 600;
    line-height: 1.25em;
`

const TopHeroButton = styled(Button)`
    margin-top: 3em;
    font-size: 1.25em;
    color: inherit;
    background-color: ${(p) => p.theme.introBackgroundColor};
    border-color: ${(p) => p.theme.introTextColor};
    border-width: 0.15em;
`

const NoTopIcon = styled(FeatherIcon)`
    top: 0;
`

export default IntroPage
