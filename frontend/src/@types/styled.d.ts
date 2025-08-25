import "styled-components"

declare module "styled-components" {
    export type LightDark = "light" | "dark"

    export interface DefaultTheme {
        type: LightDark
        primaryColors: {
            text: string
            primary: string
            secondary: string
            link: string
            info: string
            success: string
            warning: string
            danger: string
        }
        black: string
        white: string
        goose: string
        grey: string
        textColor: string
        secondTextColor: string
        backgroundColor: string
        secondBackgroundColor: string
        thirdBackgroundColor: string
        accentColor: string
        accentBackgroundColor: string
        scrollbarColor: string
        introTextColor: string
        introBackgroundColor: string
        imgIconFilter: string
        sidebar: {
            activeColor: string
            activeBackgroundColor: string
            hoverColor: string
            hoverBackgroundColor: string
            backgroundColor: string
            scrollbarColor: string
        }
        navbar: { backgroundColor: string; activeBackgroundColor: string }
        project: {
            borderColor: string
            lineColor: string
            inputColor: string
            assignColor: string
            dueColor: string
            reminderColor: string
            danger: string
        }
        skeleton: { defaultColor: string; shineColor: string }
        notifications: { boxShadowColor: string }
        social: {
            borderColor: string
            modalShadowColor: string
            modalCellHoverColor: string
            buttonColor: string
            activeColor: string
            activeBackgroundColor: string
        }
        calendar: {
            backgroundColor: string
            secondBackgroundColor: string
            todayColor: string
            hoverColor: string
        }
        help: { addressBarShadowColor: string }
        search: {
            borderColor: string
            buttonColor: string
            activatedColor: string
            activatedBackgroundColor: string
        }
        toastTheme: LightDark
    }
}
