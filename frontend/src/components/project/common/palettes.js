export const palettes = {
    theme1: [
        "red",
        "red_orange",
        "orange",
        "yellow",
        "bright_sky_blue",
        "blue",
        "magenta",
        "violet",
        "pink",
        "hot_pink",
        "light_green",
        "mint",
        "olive",
        "dark_violet",
        "deep_blue",
        "deep_indigo",
    ],
}

const light = {
    grey: "#CCCCCC",
    red: "#FF3B3B",
    red_orange: "#F05A29",
    orange: "#FF8D1B",
    yellow: "#FFAE00",
    bright_sky_blue: "#1CBFFF",
    blue: "#0787FF",
    magenta: "#F36FFF",
    violet: "#CE3AFF",
    pink: "#FF79C1",
    hot_pink: "#FF19C6",
    light_green: "#73FF88",
    mint: "#0FFFAF",
    olive: "#86A95B",
    dark_violet: "#4C00D9",
    deep_blue: "#123EFF",
    deep_indigo: "#0C0CB2",
}

const dark = {
    grey: "#858585",
    red: "#FF3B3B",
    red_orange: "#F05A29",
    orange: "#FF8D1B",
    yellow: "#FFEE00",
    bright_sky_blue: "#1CBFFF",
    blue: "#0787FF",
    magenta: "#F36FFF",
    violet: "#CE3AFF",
    pink: "#FF79C1",
    hot_pink: "#FF19C6",
    light_green: "#73FF88",
    mint: "#0FFFAF",
    olive: "#86A95B",
    dark_violet: "#772EFF",
    deep_blue: "#4769FF",
    deep_indigo: "#3333FF",
}

const themes = {
    light: light,
    dark: dark,
}

export const getProjectColor = (theme, color) => {
    return themes[theme][color]
}
