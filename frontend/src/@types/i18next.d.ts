import type docs from "@assets/locales/en/docs.json"
import type home from "@assets/locales/en/home.json"
import type intro from "@assets/locales/en/intro.json"
import type settings from "@assets/locales/en/settings.json"
import type translation from "@assets/locales/en/translation.json"

import "i18next"

declare module "i18next" {
    interface CustomTypeOptions {
        resources: {
            docs: typeof docs
            home: typeof home
            intro: typeof intro
            settings: typeof settings
            translation: typeof translation
        }
    }
}
