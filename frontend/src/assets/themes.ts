import type { DefaultTheme, LightDark } from "styled-components"

export type State = keyof DefaultTheme["primaryColors"]

const black = "#222222"
const white = "#FEFDFC"
const goose = "#ff4a03"

const light: DefaultTheme = {
    type: "light",
    primaryColors: {
        text: black,
        primary: goose,
        secondary: "#f78457",
        link: "rgb(66, 88, 255)",
        info: "rgb(102, 209, 255)",
        success: "rgb(72, 199, 142)",
        warning: "rgb(255, 183, 15)",
        danger: "rgb(255, 102, 133)",
    },
    black,
    white,
    goose,
    grey: "#cccccc",
    textColor: black,
    secondTextColor: "#9c9c9c",
    backgroundColor: white,
    secondBackgroundColor: "#F8F8F8",
    thirdBackgroundColor: "#F2F2F2",
    accentColor: goose,
    accentBackgroundColor: "#E8EEFF",
    scrollbarColor: "#FFC6C6",
    introTextColor: goose,
    introBackgroundColor: "#FFD7C7",
    imgIconFilter: "invert(0%)",
    sidebar: {
        activeColor: black,
        activeBackgroundColor: "#D9D9D9",
        hoverColor: black,
        hoverBackgroundColor: `rgb(255 74 3 / 0.35)`,
        backgroundColor: "#F9F7F6",
        scrollbarColor: "#FFC6C6",
    },
    navbar: {
        backgroundColor: "rgb(243, 243, 243, 0.9)",
        activeBackgroundColor: white,
    },
    project: {
        borderColor: "#D9D9D9",
        lineColor: "#D9D9D9",
        inputColor: "#D9D9D9",
        assignColor: "#2E61DC",
        dueColor: "#009773",
        reminderColor: "#7B2CBF",
        danger: "#FF0000",
    },
    skeleton: {
        defaultColor: "#ddd",
        shineColor: "#e8e8e8",
    },
    notifications: {
        boxShadowColor: "rgba(149, 157, 165, 0.2)",
    },
    social: {
        borderColor: black,
        modalShadowColor: "rgba(123, 123, 123, 0.1)",
        modalCellHoverColor: "#F0F0F0",
        buttonColor: "#A9A9A9",
        activeColor: "oklch(45.7% 0.24 277.023)",
        activeBackgroundColor: "oklch(96.2% 0.018 272.314)",
    },
    calendar: {
        backgroundColor: "#D9D9D9",
        secondBackgroundColor: "#E6E6E6",
        todayColor: white,
        hoverColor: "#FFC6C6",
    },
    help: {
        addressBarShadowColor: "rgba(0, 0, 0, 0.4)",
    },
    search: {
        borderColor: black,
        buttonColor: black,
        activatedColor: white,
        activatedBackgroundColor: "#F78457",
    },
    toastTheme: "light",
}

const dark: DefaultTheme = {
    type: "dark",
    primaryColors: {
        text: white,
        primary: "AccentColor",
        secondary: "#f78457",
        link: "rgb(66, 88, 255)",
        info: "rgb(102, 209, 255)",
        success: "rgb(72, 199, 142)",
        warning: "rgb(255, 183, 15)",
        danger: "#E05153",
    },
    black,
    white,
    goose,
    grey: "#858585",
    textColor: white,
    secondTextColor: "#cccccc",
    backgroundColor: black,
    secondBackgroundColor: "#2A2A2A",
    thirdBackgroundColor: "#323232",
    accentColor: goose,
    accentBackgroundColor: "#0c4a6e",
    scrollbarColor: "#4A4A4A",
    introTextColor: "#FFD7C7",
    introBackgroundColor: "#77371F",
    imgIconFilter: "invert(100%)",
    sidebar: {
        activeColor: white,
        activeBackgroundColor: black,
        hoverColor: white,
        hoverBackgroundColor: `rgb(255 74 3 / 0.35)`,
        backgroundColor: "#2F2F2F",
        scrollbarColor: "#4A4A4A",
    },
    navbar: {
        backgroundColor: "rgb(50, 50, 50, 0.9)",
        activeBackgroundColor: black,
    },
    project: {
        borderColor: "#474747",
        lineColor: "#D9D9D9",
        inputColor: "#474747",
        assignColor: "#3182F7",
        dueColor: "#02AF6D",
        reminderColor: "#9D4EEE",
        danger: "#E05153",
    },
    skeleton: {
        defaultColor: "#2A2A2A",
        shineColor: "#3A3A3A",
    },
    notifications: {
        boxShadowColor: "rgba(0, 0, 0, 0.4)",
    },
    social: {
        borderColor: white,
        modalShadowColor: "rgba(210, 210, 210, 0.1)",
        modalCellHoverColor: "#383838",
        buttonColor: "#A9A9A9",
        activeColor: "oklch(87% 0.065 274.039)",
        activeBackgroundColor: "oklch(37.1% 0 0)",
    },
    calendar: {
        backgroundColor: "#323232",
        secondBackgroundColor: "#292929",
        todayColor: white,
        hoverColor: "#804A30",
    },
    help: {
        addressBarShadowColor: "rgba(0, 0, 0, 0.8)",
    },
    search: {
        borderColor: white,
        buttonColor: white,
        activatedColor: black,
        activatedBackgroundColor: "#F78457",
    },
    toastTheme: "dark",
}

export default { light, dark } as Record<LightDark, DefaultTheme>
