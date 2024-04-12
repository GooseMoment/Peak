import { css } from "styled-components"

const black = "#222222"
const white = "#FEFDFC"
const goose = "#ff4a03"

export const defaultTheme = {
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
    textColor: black,
    backgroundColor: white,
    accentColor: goose,
    scrollbarColor: "#FFC6C6",
    sidebar: {
        activeColor: black,
        activeBackgroundColor: "#D9D9D9",
        hoverColor: black,
        hoverBackgroundColor: `rgb(255 74 3 / 0.35)`,
        backgroundColor: "#F9F7F6",
    }
}

export const states = {
    text: "text",
    link: "link",
    primary: "primary",
    secondary: "secondary",
    info: "info",
    success: "success",
    warning: "warning",
    danger: "danger",
}
