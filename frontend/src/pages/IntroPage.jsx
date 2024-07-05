import { Link } from "react-router-dom"

import Button from "@components/common/Button"
import Brand from "@components/sign/Brand"

import Section, { SectionTitle, SectionDescription } from "@components/intro/Section"
import SubSection, { SubGroup, SubTitle } from "@components/intro/SubSection"
import DemoProject from "@components/intro/DemoProject"
import DemoDrawer from "@components/intro/DemoDrawer"

import styled from "styled-components"

const IntroPage = () => {
    return <>
    <Nav>
        <Brand /> 
        <Link to="sign">
            <Button >
                Sign in
            </Button>
        </Link>
    </Nav>
    <TopHero>
        <TopTitle>
            Plan, Organize, and Cheer. <br/>
            Do all them in Peak.
        </TopTitle>
        <Link to="sign">
            <TopHeroButton>
                Start
            </TopHeroButton>
        </Link>
    </TopHero>

    <Section>
        <SectionTitle>Organize</SectionTitle>
        <SectionDescription>Place tasks in the right place with projects and drawers.</SectionDescription>
        <SubGroup>
            <DemoProject />
            <DemoDrawer />
        </SubGroup>
    </Section>

    <Section>
        <SectionTitle>Plan</SectionTitle>
        <SectionDescription>Track priority and deadline of tasks.</SectionDescription>
        <SubGroup>
            <SubSection>
                <SubTitle>A project contains drawers.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>A drawer is home for tasks.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>Put tasks under drawers.</SubTitle>
            </SubSection>
        </SubGroup>
    </Section>

    <Section>
        <SectionTitle>Share</SectionTitle>
        <SectionDescription>Share your daily log with your friends.</SectionDescription>
        <SubGroup>
            <SubSection>
                <SubTitle>A project contains drawers.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>A drawer is home for tasks.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>Put tasks under drawers.</SubTitle>
            </SubSection>
        </SubGroup>
    </Section>

    <Section>
        <SectionTitle>Cheer</SectionTitle>
        <SectionDescription>Put reactions to your friends’ tasks with fancy emojis. Make motivate and get motivated.</SectionDescription>
        <SubGroup>
            <SubSection>
                <SubTitle>A project contains drawers.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>A drawer is home for tasks.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>Put tasks under drawers.</SubTitle>
            </SubSection>
        </SubGroup>
    </Section>

    <Section>
        <SectionTitle>Customize</SectionTitle>
        <SectionDescription>Customize an apperance of Peak.</SectionDescription>
        <SubGroup>
            <SubSection>
                <SubTitle>A project contains drawers.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>A drawer is home for tasks.</SubTitle>
            </SubSection>
            <SubSection>
                <SubTitle>Put tasks under drawers.</SubTitle>
            </SubSection>
        </SubGroup>
    </Section>
    </>
}

const Nav = styled.nav`
    position: fixed;
    padding: 2rem;
    padding-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: start;
    width: 100%;
    box-sizing: border-box;

    z-index: 10;
`

const TopHero = styled(Section)`
    color: ${p => p.theme.frontSignPageTextColor};
    background-color: ${p => p.theme.frontSignPageBackgroundColor};
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
    background-color: ${p => p.theme.frontSignPageBackgroundColor};
    border-color: ${p => p.theme.frontSignPageTextColor};
    border-width: 0.15em;
`


export default IntroPage