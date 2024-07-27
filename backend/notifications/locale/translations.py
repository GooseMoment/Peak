from django.conf import settings

from .en import translation as EN
from .ko import translation as KO

translations = {
    "en": EN,
    "ko": KO,
}

def get_translations(locale: str):
    if locale in translations.keys():
        return translations[locale]
    
    return translations[settings.LANGUAGE_CODE]
