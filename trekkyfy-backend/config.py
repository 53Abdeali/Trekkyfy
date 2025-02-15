import os
import secrets
from itsdangerous import URLSafeTimedSerializer

SECRET_KEY = os.getenv("SECRET_KEY", "66da30be6ce1360c4614b51ed81f8b313847a1920d814d6ef2c07bf2abb28e06")
s = URLSafeTimedSerializer(SECRET_KEY)
salt = secrets.token_hex(16)
