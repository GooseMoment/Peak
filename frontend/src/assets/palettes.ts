import type { LightDark } from "styled-components"

export type PaletteColorName =
    | "grey"
    | "red"
    | "red_orange"
    | "orange"
    | "yellow"
    | "bright_sky_blue"
    | "blue"
    | "magenta"
    | "violet"
    | "pink"
    | "hot_pink"
    | "light_green"
    | "mint"
    | "olive"
    | "dark_violet"
    | "deep_blue"
    | "deep_indigo"

export const palettes = {
    palette1: [
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
    ] as PaletteColorName[],
}

type Palette = Record<PaletteColorName, string>

const light: Palette = {
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

const dark: Palette = {
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

const lightPastel: Palette = {
    grey: "#CCCCCC",
    red: "#FAA0A0",
    red_orange: "#FF8E83",
    orange: "#FF8E83",
    yellow: "#FFE168",
    bright_sky_blue: "#80ECF6",
    blue: "#53D4FF",
    magenta: "#DCB5FF",
    violet: "#E39CF8",
    pink: "#FFBBEB",
    hot_pink: "#FF97C3",
    light_green: "#99F8BD",
    mint: "#5FE6C9",
    olive: "#C9DBB2",
    dark_violet: "#AA84EF",
    deep_blue: "#94DAFF",
    deep_indigo: "#6A9CFD",
}

const darkPastel: Palette = {
    grey: "#CCCCCC",
    red: "#E27C7C",
    red_orange: "E38D6B",
    orange: "#F2A866",
    yellow: "#D7C774",
    bright_sky_blue: "#7EBFD9",
    blue: "#6FAEF5",
    magenta: "#E6A7F2",
    violet: "#D99CF2",
    pink: "#F6A9C9",
    hot_pink: "#E26ABD",
    light_green: "#94D99B",
    mint: "#7CCFB6",
    olive: "#A3B77D",
    dark_violet: "#A08BFF",
    deep_blue: "#94DAFF",
    deep_indigo: "#7C8AE6",
}

const themes = {
    light: light,
    dark: dark,
}

const pastelThemes = {
    light: lightPastel,
    dark: darkPastel,
}

export const getPaletteColor = (
    theme: LightDark,
    colorName: PaletteColorName,
) => {
    return themes[theme][colorName]
}

export const getPastelPaletteColor = (
    theme: LightDark,
    colorName: PaletteColorName,
) => {
    return pastelThemes[theme][colorName]
}
