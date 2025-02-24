import type docs from "@public/locales/en/docs.json"
import type home from "@public/locales/en/home.json"
import type intro from "@public/locales/en/intro.json"
import type settings from "@public/locales/en/settings.json"
import type translation from "@public/locales/en/translation.json"

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
