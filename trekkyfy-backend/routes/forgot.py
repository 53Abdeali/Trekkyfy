from Flask import Blueprint, request, jsonify # type: ignore
from models import User
from flask_mail import Message # type: ignore
from app import mail, s, salt

forgot_bp = Blueprint("forgot-password", __name__)

@forgot_bp.route("/forgot-password", methods = ["POST"])
def forgot_password():
    data = request.get_json()
    
    email = data.get("email")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message" : "If the email is registered, a reset link will be sent."}),200
    
    token = s.dumps(email, salt=salt)
    
    reset_url = f"https://trekkyfy.vercel.app/reset-password/{token}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
            <a href="https://imgbb.com/"><img style= "width:100px; height:100px" src="https://i.ibb.co/0VtXQSkm/ty.png" alt="ty" border="0"></a>
        </div>
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi,</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="{reset_url}" style="color: #007BFF; text-decoration: none;">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p style="color: #555;">Thank you,<br/>The Trekkyfy Team</p>
    </body>
    </html>
    """
    
    msg = Message("Password Reset Request",
                  sender="aliabdealifakhri53@gmail.com",
                  recipients=[email])
    msg.html = html_content
    mail.send(msg)

    return jsonify({"message": "If the email is registered, a reset link has been sent."}), 200
