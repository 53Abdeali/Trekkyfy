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
from routes.guide_complete import guide_bp
from routes.image_upload import image_upload_bp
from routes.pending_requests import pending_req_bp
from routes.pending_responses import chat_resp_bp
from routes.hiker_info import hiker_info_bp
from routes.priavl_guide_res import priavl_guide_res_bp
from routes.wishlist import wishlist_bp
from routes.hiker_details import hiker_details_bp
from routes.booking import booking_bp
from machine_learning import trek_rec_bp

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
    
    #API for Guide Profile Upate
    app.register_blueprint(guide_bp, url_prefix="/api")
    
    #API for Guide Profile Photo Upload on Cloudinary
    app.register_blueprint(image_upload_bp, url_prefix="/api")
    
    #API for Pending Requests
    app.register_blueprint(pending_req_bp, url_prefix="/api")
    
    #API for Pending Responses
    app.register_blueprint(chat_resp_bp, url_prefix="/api")
    
    #API for Pricing and Availabilty by Hiker
    app.register_blueprint(hiker_info_bp, url_prefix="/api")
    
    #API Response from Guide for Pricing and Availabilty by Hiker
    app.register_blueprint(priavl_guide_res_bp, url_prefix="/api")
    
    #API for Wishlist GET, ADD, REMOVE by Hiker
    app.register_blueprint(wishlist_bp, url_prefix="/api")
    
    #API for hiker Details 
    app.register_blueprint(hiker_details_bp, url_prefix="/api")
    
    #API for Booking Confirm
    app.register_blueprint(booking_bp, url_prefix="/api")
    
    #API for Trek Recommendations
    app.register_blueprint(trek_rec_bp, url_prefix="/api")
    
    