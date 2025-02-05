import os
import hashlib
import base64
import hmac
from time import time
from urllib.parse import urlencode, quote as urlquote


def create_totp_secret() -> str:
    return base64.b32encode(os.urandom(30)).decode()


# HOTP: https://datatracker.ietf.org/doc/html/rfc4226
class HOTP:
    oath_type = "hotp"

    def __init__(self, secret_b32: str, digits: int = 6, algorithm: str = "sha1"):
        self._secret_b32 = secret_b32
        self._secret = base64.b32decode(secret_b32)
        self._digits = digits
        self._algorithm = algorithm.lower()

        if self._algorithm not in hashlib.algorithms_available:
            raise ValueError("Invalid algorithm.")

    def get_secret(self) -> str:
        return self._secret_b32

    @staticmethod
    def _dynamic_truncate(mac: bytes):
        offset = mac[-1] % 16
        truncated = mac[offset : offset + 4]  # truncated: 4 bytes

        # clean MSB to avoid problems related to the sign bit
        truncated = bytes([truncated[0] & 0x7F, *truncated[1:]])

        num = int.from_bytes(truncated, "big")
        return num

    def hotp(self, counter: int) -> str:
        counter_bytes = counter.to_bytes(8, "big")
        hs = hmac.digest(self._secret, counter_bytes, self._algorithm)
        s_num = self._dynamic_truncate(hs)
        code = str(s_num % 10**self._digits)

        # add leading zeros
        if len(code) < self._digits:
            code = code.rjust(self._digits, "0")

        return code

    def get_uri_query(self, issuer: str | None = None):
        query = {
            "secret": self._secret_b32,
            "algorithm": self._algorithm.upper(),
            "digits": self._digits,
        }

        if issuer is not None:
            query["issuer"] = issuer

        return query

    # https://github.com/google/google-authenticator/wiki/Key-Uri-Format
    # https://docs.yubico.com/yesdk/users-manual/application-oath/uri-string-format.html
    # account and issuer MUST not include any colons.
    def get_uri(self, account: str, issuer=None):
        label = account
        if issuer is not None:
            label = issuer + ":" + account

        label = urlquote(label)

        uri = "otpauth://" + self.oath_type + "/" + label + "?"
        query = self.get_uri_query(issuer)
        return uri + urlencode(query, quote_via=urlquote)


# TOTP: https://datatracker.ietf.org/doc/html/rfc6238
class TOTP(HOTP):
    oath_type = "totp"

    offset_start = -2  # inclusive
    offset_end = 2  # exclusive
    _period = 30  # seconds

    def get_timestamp(self) -> int:
        return int(time())

    def totp(self, offset: int = 0) -> str:
        counter = self.get_timestamp() // self._period + offset
        return self.hotp(counter)

    def totp_with_offsets(self) -> list[str]:
        codes = []
        t = self.get_timestamp()

        for offset in range(self.offset_start, self.offset_end):
            counter = t // self._period + offset
            codes.append(self.hotp(counter))

        return codes

    def get_uri_query(self, issuer=None):
        query = super().get_uri_query(issuer)
        query["period"] = self._period
        return query
