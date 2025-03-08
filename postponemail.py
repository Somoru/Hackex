import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pymongo import MongoClient

# ✅ MongoDB Connection (Database name is hacx)
MONGO_URI = "mongodb+srv://yudiapp:yudiapp2024@cluster0.th91t.mongodb.net/hacx?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client["hacx"]  # Database name
users_collection = db["users"]  # Collection containing user emails

# ✅ SMTP Settings
SMTP_SERVER = "smtpout.secureserver.net"
SMTP_PORT = 587
SENDER_EMAIL = "team@hackex.in"
SENDER_PASSWORD = "Hacx@9999"  # App Password if using 2FA

# ✅ Fetch emails from MongoDB
def get_all_emails():
    emails = users_collection.find({}, {"email": 1, "_id": 0})  
    return [user["email"] for user in emails if "email" in user]

# ✅ Email Content
EMAIL_SUBJECT = "🚀 HackEx Coding Challenge Update"
EMAIL_HTML = """\
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HackEx Coding Challenge Update</title>
    <style>
        body { background-color: #0d1117; color: #c9d1d9; font-family: Arial, sans-serif; padding: 0; margin: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #161b22; padding: 30px; border-radius: 8px; text-align: center; }
        h1 { color: #58a6ff; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        h2 { color: #ff7b72; font-size: 22px; margin-bottom: 15px; }
        p { font-size: 16px; line-height: 1.5; color: #c9d1d9; }
        .highlight { color: #ff7b72; font-weight: bold; }
        .cta { margin-top: 25px; }
        .cta a { background-color: #238636; color: #ffffff; padding: 12px 20px; border-radius: 5px; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; }
        .cta a:hover { background-color: #2ea043; }
        .divider { border-top: 1px solid #30363d; margin: 20px 0; }
        .footer { font-size: 14px; color: #8b949e; }
        .footer a { color: #58a6ff; text-decoration: none; }
    </style>
</head>
<body>
<div class="container">
    <h1>🚀 IMPORTANT ANNOUNCEMENT</h1>
    <h2>Coding Challenge Rescheduled</h2>
    <div class="divider"></div>
    <p>We sincerely apologize for the delay in starting the <span class="highlight">HackEx Coding Challenge</span>. Due to unforeseen circumstances, we are unable to commence today, <span class="highlight">5th March 2025</span>.</p>
    <p>The challenge has now been rescheduled from <span class="highlight">8th March 2025 to 15th March 2025</span>.</p>
    <div class="divider"></div>
    <p>We appreciate your patience and understanding. In the meantime, invite your friends and compete together!</p>
    <div class="cta"><a href="https://www.hackex.in/register" target="_blank">Invite Friends</a></div>
    <p><em>"A minor setback is just a setup for a greater comeback."</em></p>
    <div class="divider"></div>
    <p class="footer">See you on <span class="highlight">8th March</span>! 🚀</p>
    <p class="footer">Best Regards,</p>
    <p class="footer"><strong>The HackEx Team</strong></p>
    <p class="footer">Need help? <a href="mailto:support@hackex.in">Contact Support</a></p>
</div>
</body>
</html>
"""

# ✅ Function to send an email
def send_email(to_email):
    try:
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg["Subject"] = EMAIL_SUBJECT
        msg.attach(MIMEText(EMAIL_HTML, "html"))

        # Connect to SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=ssl.create_default_context())  # Secure connection
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, msg.as_string())

        print(f"✅ Email sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")

# ✅ Function to send bulk emails
def send_bulk_emails():
    emails = get_all_emails()
    if not emails:
        print("⚠️ No emails found in the database.")
        return
    
    print(f"📧 Sending emails to {len(emails)} users...")
    for email in emails:
        send_email(email)

# ✅ Run script to send to all users
if __name__ == "__main__":
    print("📧 Sending emails to all registered users in HackEx...")
    send_bulk_emails()
    print("✅ All emails sent!")
