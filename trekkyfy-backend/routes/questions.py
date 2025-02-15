from models import Question
from Flask import Blueprint, request, jsonify # type: ignore
from extensions import db
from app import mail
from flask_mail import Message  # type: ignore

ques_bp = Blueprint("question", __name__)

@ques_bp.route("/question", methods = ["POST"])   
def frequent_question():
    data = request.get_json()
    question = data.get("question")
    email = data.get("email")
    
    try:
        if not question or not email:
            return jsonify({"error" : "None of the both field could be empty."}),500
        
        new_question = Question(question = question, email = email)
        db.session.add(new_question)
        db.session.commit()
        
        html_content = """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
         <style>
          @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          .trekkyfy {
            font-family: 'Alex Brush', cursive;
            font-size: 2rem;
            color: #212b43;
            text-align: center;
            margin-bottom: 20px;
          }
        </style>
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 class="trekkyfy>Trekkyfy</h1>
        </div>
        <h2 style="color: #2c3e50;">We've Received Your Question! 📩</h2>
        <p>Hi there,</p>
        <p>
            Thank you for reaching out to Trekkyfy! We truly appreciate your curiosity and engagement. Your question has been received, and our team will review it shortly.
        </p>
        <p>
            If your question is relevant and aligns with our 
            <a href="https://www.Trekkyfy.com/terms" style="color: #2980b9; text-decoration: none;">Terms & Conditions</a> 
            and 
            <a href="https://www.Trekkyfy.com/privacy" style="color: #2980b9; text-decoration: none;">Privacy Policy</a>, 
            we will get back to you as soon as possible. We strive to provide accurate and helpful information to enhance your trekking experience.
        </p>  
        <p>Meanwhile, here are some key features you can explore:</p>    
        <ul style="padding-left: 20px;">
            <li>🌍 Discover breathtaking trekking destinations.</li>
            <li>🗺️ Plan with expert-curated itineraries.</li>
            <li>🚐 Enjoy hassle-free shuttle services to your trek.</li>
            <li>🤝 Connect with local guides for an authentic adventure.</li>
        </ul>
        <p>
            Stay tuned for updates on upcoming treks, exclusive travel tips, and community experiences!
        </p>
        <p>
            If you have any additional inquiries, feel free to reply to this email or reach out to us directly.
        </p>
        <p style="font-weight: bold;">We appreciate your patience and look forward to assisting you! 🌍✨</p> 
        <p style="color: #555;">
            Happy trekking!<br/>
            Warm Regards,<br/>
            The Trekkyfy Team
        </p>
        </body>
        </html>
        """
        
        msg = Message("Question Reieved Confirmation", 
                      sender = "aliabdealifakhri53@gmail.com" , 
                      recipients = [email])
        msg.html = html_content
        mail.send(msg)
        
        return jsonify({"message" : "Question have been submitted successfully!"}),200
    except Exception as e :
        print(e)
        return jsonify({"error": "Some error occured"}), 500