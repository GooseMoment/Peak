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
    secondBackgroundColor: "#F3F3F3",
    thirdBackgroundColor: "#F3F3F3", // 원래 second랑 똑같은 건 의도된건가...?
    accentColor: goose,
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
        backgroundColor: "rgb(255, 255, 255, 0.7)",
    },
    project: {
        borderColor: "#D9D9D9",
        lineColor: "#D9D9D9",
        inputColor: "#D9D9D9",
        assignColor: "#2E61DC",
        dueColor: "#009773",
        reminderColor: "#7B2CBF",
        danger: "#FF0000",
        imgColor:
            "invert(6%) sepia(7%) saturate(65%) hue-rotate(314deg) brightness(100%) contrast(84%)",
        imgGreyColor:
            "invert(92%) sepia(0%) saturate(58%) hue-rotate(169deg) brightness(102%) contrast(70%)",
        imgDangerColor:
            "invert(20%) sepia(92%) saturate(7288%) hue-rotate(358deg) brightness(106%) contrast(115%)",
        imgDueColor:
            "invert(42%) sepia(80%) saturate(4726%) hue-rotate(148deg) brightness(94%) contrast(101%)",
        imgReminderColor:
            "invert(23%) sepia(38%) saturate(4190%) hue-rotate(259deg) brightness(91%) contrast(101%)",
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
        activeBackgroundColor: "rgb(255 74 3 / 0.35)",
        modalShadowColor: "rgba(123, 123, 123, 0.1)",
        modalCellHoverColor: "#F0F0F0",
        buttonColor: "#A9A9A9",
    },
    calendar: {
        backgroundColor: "#D9D9D9",
        secondBackgroundColor: "#E6E6E6",
        todayColor: white,
        hoverColor: "#FFC6C6",
    },
    search: {
        buttonColor: black,
    },
    toastTheme: "light",
}

export const dark = {
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
    secondBackgroundColor: "#323232",
    thirdBackgroundColor: "#2A2A2A",
    accentColor: goose,
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
        backgroundColor: "rgb(0, 0, 0, 0.7)",
    },
    project: {
        borderColor: "#474747",
        lineColor: "#D9D9D9",
        inputColor: "#474747",
        assignColor: "#3182F7",
        dueColor: "#02AF6D",
        reminderColor: "#9D4EEE",
        danger: "#E05153",
        imgColor:
            "invert(99%) sepia(72%) saturate(487%) hue-rotate(309deg) brightness(117%) contrast(99%)",
        imgGreyColor:
            "invert(56%) sepia(4%) saturate(11%) hue-rotate(26deg) brightness(92%) contrast(89%)",
        imgDangerColor:
            "invert(40%) sepia(69%) saturate(3544%) hue-rotate(331deg) brightness(94%) contrast(86%)",
        imgDueColor:
            "invert(42%) sepia(93%) saturate(2201%) hue-rotate(130deg) brightness(96%) contrast(98%)",
        imgReminderColor:
            "invert(42%) sepia(58%) saturate(5361%) hue-rotate(253deg) brightness(93%) contrast(85%)",
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
        activeBackgroundColor: "rgb(255 74 3 / 0.35)",
        modalShadowColor: "rgba(210, 210, 210, 0.1)",
        modalCellHoverColor: "#383838",
        buttonColor: "#A9A9A9",
    },
    calendar: {
        backgroundColor: "#323232",
        secondBackgroundColor: "#292929",
        todayColor: white,
        hoverColor: "#804A30",
    },
    search: {
        buttonColor: white,
    },
    toastTheme: "dark",
}

const themes = {
    system: null,
    light: light,
    dark: dark,
}

export default themes
