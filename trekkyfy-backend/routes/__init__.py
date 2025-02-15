from flask import Flask
from routes.registeration import reg_bp
from routes.auth_login import log_bp
from routes.user_profiles import user_profile_bp
from routes.auth_logout import logout_bp
from routes.forgot import forgot_bp
from routes.reset import reset_bp
from routes.newsletter import news_bp
from routes.feedback_submit import feedback_bp
from routes.questions import ques_bp
from routes.contact import contact_bp
from routes.explore_trek import explore_trek_bp

def register_blueprints(app: Flask):
    # API Call for Register
    app.register_blueprint(reg_bp, url_prefix = "/api")

    # API Call for Login
    app.register_blueprint(log_bp, url_prefix = "/api")

    #Protected Route (Get Cookies)
    app.register_blueprint(user_profile_bp, url_prefix="/api")
    
    #API Call for Logout
    app.register_blueprint(logout_bp, url_prefix="/api")

    #API Call for Forgot Password
    app.register_blueprint(forgot_bp, url_prefix="/api")

    #API for Reset Password
    app.register_blueprint(reset_bp, url_prefix="/api")

    #API for Newsletter Subscription
    app.register_blueprint(news_bp, url_prefix="/api")

    #API for Feedback
    app.register_blueprint(feedback_bp, url_prefix="/api")

    #API for Questions
    app.register_blueprint(ques_bp, url_prefix="/api")

    #API for Contact
    app.register_blueprint(contact_bp, url_prefix="/api")

    #API for Explore_Trek
    app.register_blueprint(explore_trek_bp, url_prefix="/api")