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

const black = "#222222"
const white = "#FEFDFC"
const goose = "#ff4a03"

export const light = {
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
    backgroundColor: white,
    secondBackgroundColor: "#F3F3F3",
    accentColor: goose,
    scrollbarColor: "#FFC6C6",
    frontSignPageTextColor: goose,
    frontSignPageBackgroundColor: "#FFD7C7",
    sidebar: {
        activeColor: black,
        activeBackgroundColor: "#D9D9D9",
        hoverColor: black,
        hoverBackgroundColor: `rgb(255 74 3 / 0.35)`,
        backgroundColor: "#F9F7F6",
    },
    project: {
        borderColor: "#D9D9D9",
        lineColor: "#D9D9D9",
        inputColor: "#D9D9D9",
        imgColor: "invert(6%) sepia(7%) saturate(65%) hue-rotate(314deg) brightness(100%) contrast(84%)",
    }
}

export const lightSystemcolor = Object.assign({}, light, {
    primaryColors: Object.assign({}, light.primaryColors, {
        primary: "AccentColor",
    }),
    accentColor: "AccentColor",
    sidebar: {
        activeColor: "HighlightText",
        activeBackgroundColor: "Highlight",
        hoverColor: black,
        hoverBackgroundColor: "#D9D9D9",
        backgroundColor: "#F9F7F6",
    }
})

export const dark = {
    primaryColors: {
        text: white,
        primary: "AccentColor",
        secondary: "#f78457",
        link: "rgb(66, 88, 255)",
        info: "rgb(102, 209, 255)",
        success: "rgb(72, 199, 142)",
        warning: "rgb(255, 183, 15)",
        danger: "#E32C20",
    },
    black,
    white,
    goose,
    grey: "rgb(133, 133, 133)",
    textColor: white,
    backgroundColor: black,
    secondBackgroundColor: "#474747",
    accentColor: goose,
    scrollbarColor: "#2A2A2A",
    frontSignPageTextColor: goose,
    frontSignPageBackgroundColor: "#FFD7C7",
    sidebar: {
        activeColor: white,
        activeBackgroundColor: black,
        hoverColor: white,
        hoverBackgroundColor: `rgb(255 74 3 / 0.35)`,
        backgroundColor: "#2F2F2F",
    },
    project: {
        borderColor: "#474747",
        lineColor: "#D9D9D9",
        inputColor: "#474747",
        imgColor: "invert(99%) sepia(72%) saturate(487%) hue-rotate(309deg) brightness(117%) contrast(99%)",
    }
}

export const darkSystemcolor = Object.assign({}, dark, {
    primaryColors: Object.assign({}, dark.primaryColors, {
        primary: "AccentColor",
    }),
    accentColor: "AccentColor",
    sidebar: {
        activeColor: "HighlightText",
        activeBackgroundColor: "Highlight",
        hoverColor: white,
        hoverBackgroundColor: black,
        backgroundColor: "#2F2F2F",
    }
})

const themes = {
    "system": null,
    "light": light,
    "light-systemcolor": lightSystemcolor,
    "dark": dark,
    "dark-systemcolor": darkSystemcolor,
}

export default themes
