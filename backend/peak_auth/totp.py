import os
import hashlib
import base64
import hmac
from time import time


def create_new_key() -> str:
    return str(base64.b32encode(os.urandom(30)))


# HOTP: https://datatracker.ietf.org/doc/html/rfc4226
class HOTP:
    h = hashlib.sha1

    def __init__(self, secret_b32: str, code_length: int = 6):
        self.secret = base64.b32decode(secret_b32)
        self.code_length = code_length

    def dynamic_truncate(self, mac: bytes):
        offset = mac[-1] % 16
        truncated = mac[offset:offset+4] # truncated: 4 bytes

        # clean MSB to avoid problems related to the sign bit
        truncated = bytes([0, *truncated[1:]]) 

        num = int.from_bytes(truncated, "big")
        return num 

    def hotp(self, counter: int) -> str:
        counter_bytes = counter.to_bytes(8, "big")
        hs = hmac.digest(self.secret, counter_bytes, self.h)
        s_num = self.dynamic_truncate(hs)
        code = str(s_num % 10 ** self.code_length)

        # add leading zeros 
        if len(code) < self.code_length:
            code = code.rjust(self.code_length, "0")

        return code


# TOTP: https://datatracker.ietf.org/doc/html/rfc6238
class TOTP(HOTP):
    offset_start = -2 # inclusive
    offset_end = 2 # exclusive
    tx = 30 # seconds

    def get_timestamp(self) -> int:
        return int(time())

    def totp(self, offset: int = 0) -> str:
        counter = self.get_timestamp() // self.tx + offset
        return self.hotp(counter)
    
    def totp_with_offsets(self) -> list[str]:
        codes = []
        t = self.get_timestamp()

        for offset in range(self.offset_start, self.offset_end):
            counter = t // self.tx + offset
            codes.append(self.hotp(counter))
        
        return codes
