from django.conf import settings

from .en import translation as EN
from .ko import translation as KO

translations = {
    "en": EN,
    "ko": KO,
}

def get_translations(locale: str):
    for code in translations.keys():
        if locale.startswith(code):
            return translations[code]

    return translations[settings.LANGUAGE_CODE]
