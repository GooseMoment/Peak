import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import Switch from "@components/settings/Switch"
import Button, { ButtonGroup, buttonForms } from "@components/common/Button"
import { states } from "@assets/themes"

const Appearance = () => {

    return <>
        <PageTitle>Appearance</PageTitle>
        <Section>
            <Name>Theme perference</Name>
            <Value>
                <Select choices={themeChoices} name="theme" />
            </Value>
        </Section>

        <Section>
            <Name>Content width</Name>
            <Value>
                <Select choices={widthChoices} name="main_width" />
            </Value>
        </Section>

        <Section>
            <Name>Close sidebar on start up</Name>
            <Value>
                <Switch name="close_sidebar_on_startup" />
            </Value>
        </Section>

        <ButtonGroup $justifyContent="right">
            <Button $form={buttonForms.FILLED} $state={states.SUCCESS} onClick={() => window.location.reload()}>Apply</Button>
        </ButtonGroup>
    </>
}

const themeChoices = [
    {
        display: "Same as system",
        value: "system",
    },
    {
        display: "Light",
        value: "light",
    },
    {
        display: "Dark",
        value: "dark",
    },
]

const widthChoices = [
    {
        display: "narrow",
        value: "7rem",
    }, 
    {
        display: "normal",
        value: "5rem",
    }, 
    {
        display: "wide",
        value: "2rem",
    }, 
]

export default Appearance