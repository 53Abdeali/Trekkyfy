from flask_sqlalchemy import SQLAlchemy  # type: ignore
from flask_jwt_extended import JWTManager  # type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from flask_mail import Mail # type: ignore

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
mail = Mail()