const black = "#222222"
const white = "#FEFDFC"
const goose = "rgb(255, 74, 3)"

export const defaultTheme = {
    // from: https://bulma.io/documentation/helpers/palette-helpers/
    primaryColors: {
        text: black,
        link: "rgb(66, 88, 255)",
        primary: "#2e6deb",
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
    sidebar: {
        activeColor: "#D9D9D9",
        hoverColor: "#FFC6C6",
        backgroundColor: "#F9F7F6",
    }
}

export const states = {
    TEXT: "text",
    LINK: "link",
    PRIMARY: "primary",
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    DANGER: "danger",
}
