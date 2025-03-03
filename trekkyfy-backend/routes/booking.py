from flask import Blueprint, request, jsonify
from models import db, Booking
from flask_mail import Message  # type: ignore
from extensions import mail
import pymysql  # type: ignore

booking_bp = Blueprint("booking_bp", __name__)


@booking_bp.route("/confirmBooking", methods=["POST"])
def confirm_booking():
    data = request.get_json()
    try:
        new_booking = Booking(
            hiker_id=data.get("hiker_id"),
            trek_id=data.get("trek_id"),
            guide_id=data.get("guide_id"),
            details=data,
        )
        db.session.add(new_booking)
        db.session.commit()

        hiker_email = data.get("hiker_email")
        guide_email = data.get("guide_email")

        hiker_html = """
        <html>
          <head>
            <style>
              @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 20px;
              }
              .trekkyfy {
                font-family: 'Alex Brush', cursive;
                font-size: 2rem;
                color: #212b43;
                text-align: center;
                margin-bottom: 20px;
              }
              .content {
                max-width: 600px;
                margin: 0 auto;
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #212b43;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="content">
              <div style="text-align: center;">
                <h1 class="trekkyfy">Trekkyfy</h1>
              </div>
              <h2 style="color: #2c3e50; text-align: center;">Booking Confirmed! 🌿⛰️</h2>
              <p>Dear Hiker,</p>
              <p>Your booking has been confirmed successfully. Please click the link below to view your guide's profile. You can then contact them for further details.</p>
              <div style="text-align: center;">
                <a class="button" href="https://trekkyfy.vercel.app/guides">View Guide Profile</a>
              </div>
              <p>Thank you for booking with Trekkyfy!</p>
              <p>Best regards,<br/>The Trekkyfy Team</p>
            </div>
          </body>
        </html>
        """

        guide_html = """
        <html>
          <head>
            <style>
              @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 20px;
              }
              .trekkyfy {
                font-family: 'Alex Brush', cursive;
                font-size: 2rem;
                color: #212b43;
                text-align: center;
                margin-bottom: 20px;
              }
              .content {
                max-width: 600px;
                margin: 0 auto;
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #212b43;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="content">
              <div style="text-align: center;">
                <h1 class="trekkyfy">Trekkyfy</h1>
              </div>
              <h2 style="color: #2c3e50; text-align: center;">New Booking Assigned</h2>
              <p>Dear Guide,</p>
              <p>You have been assigned a new booking. Please log in to your dashboard to review the booking details and contact the hiker as soon as possible.</p>
              <div style="text-align: center;">
                <a class="button" href="https://yourdomain.com/dashboard">Go to Dashboard</a>
              </div>
              <p>Thank you,<br/>The Trekkyfy Team</p>
            </div>
          </body>
        </html>
        """

        # Send email to hiker
        if hiker_email:
            msg_hiker = Message(
                subject="Booking Confirmed - Trekkyfy",
                sender="aliabdealifakhri53@gmail.com",
                recipients=[hiker_email],
                html=hiker_html,
            )
            mail.send(msg_hiker)

        # Send email to guide
        if guide_email:
            msg_guide = Message(
                subject="New Booking Assigned - Trekkyfy",
                sender="aliabdealifakhri53@gmail.com",
                recipients=[guide_email],
                html=guide_html,
            )
            mail.send(msg_guide)

        return (
            jsonify({"message": "Booking confirmed!", "booking_id": new_booking.id}),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error confirming booking", "error": str(e)}), 500
