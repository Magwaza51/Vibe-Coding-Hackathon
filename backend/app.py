from cryptography.fernet import Fernet
import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Fernet key from environment variable
FERNET_KEY = os.environ.get('FERNET_KEY', 'Dj8padfx_VVBvqgD8uinAOllKGwTNO_94jr2KsLxmto=')
if isinstance(FERNET_KEY, str):
    try:
        FERNET_KEY = FERNET_KEY.encode()
    except Exception:
        pass

from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
import mysql.connector
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

cipher = Fernet(FERNET_KEY)



app = Flask(__name__)
# Allow deployed frontend, both backend URLs, and localhost for CORS
CORS(app, resources={r"/*": {"origins": [
    "https://vibe-coding-hackathon-ht03.onrender.com",  # frontend
    "https://vibe-coding-hackathon-2.onrender.com",     # backend (main)
    "https://vibe-coding-hackathon.onrender.com",       # backend (alt, just in case)
    "http://localhost:3000"
]}})

import hashlib
import os
from datetime import datetime
import requests
import smtplib
from email.mime.text import MIMEText
from fpdf import FPDF
import io

app.secret_key = os.urandom(24)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
jwt = JWTManager(app)
app.secret_key = os.urandom(24)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
jwt = JWTManager(app)

# Register payments_demo_api blueprint

from payments_demo_api import payments_demo_api
from flask_cors import CORS as BlueprintCORS
BlueprintCORS(payments_demo_api)
app.register_blueprint(payments_demo_api)

# CORS test route
@app.route('/cors-test')
def cors_test():
    return "CORS is working!"


# Database connection
from db import get_db

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def home():
    return "Hello"

# Get all doctors
@app.route('/doctors', methods=['GET'])
def get_doctors():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, specialty, location FROM doctors")
    doctors = cursor.fetchall()
    cursor.close()
    db.close()
    # Add placeholder images for now
    for i, doc in enumerate(doctors):
        doc['image'] = f'https://randomuser.me/api/portraits/men/{30+i}.jpg' if i % 2 == 0 else f'https://randomuser.me/api/portraits/women/{40+i}.jpg'
    return jsonify(doctors)

# User registration (adults)
@app.route('/register', methods=['POST'])
def register():
    print("Register endpoint hit")
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    age = data.get('age')
    is_parent = data.get('is_parent', False)
    children = data.get('children', [])
    medical_history = data.get('history', '')
    # Encrypt medical history
    encrypted_history = cipher.encrypt(medical_history.encode()).decode() if medical_history else None
    if not all([name, email, password, age]):
        return jsonify({'error': 'Missing fields'}), 400
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password_hash, age, is_parent, medical_history) VALUES (%s, %s, %s, %s, %s, %s)",
                       (name, email, hash_password(password), age, is_parent, encrypted_history))
        user_id = cursor.lastrowid
        for child in children:
            cursor.execute("INSERT INTO children (parent_id, name, age) VALUES (%s, %s, %s)",
                           (user_id, child['name'], child['age']))
        db.commit()
        return jsonify({'message': 'User registered successfully'})
    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s AND password_hash=%s", (email, hash_password(password)))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    if user:
        session['user_id'] = user['id']
        access_token = create_access_token(identity={'user_id': user['id'], 'role': user.get('role', 'user')})
        return jsonify({'message': 'Login successful', 'access_token': access_token})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Add medical record (encrypt prescription)
@app.route('/medical_record', methods=['POST'])
def add_medical_record():
    data = request.json
    user_id = data.get('user_id')
    child_id = data.get('child_id')
    symptoms = data.get('symptoms')
    diagnosis = data.get('diagnosis')
    prescription = data.get('prescription')
    # Encrypt prescription (or any sensitive field)
    encrypted_prescription = cipher.encrypt(prescription.encode()).decode() if prescription else None
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO medical_records (user_id, child_id, symptoms, diagnosis, prescription) VALUES (%s, %s, %s, %s, %s)",
                       (user_id, child_id, symptoms, diagnosis, encrypted_prescription))
        db.commit()
        return jsonify({'message': 'Medical record added'})
    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# Book appointment
@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    # Get additional fields for appointments table
    data = request.json
    name = data.get('name')
    email = data.get('email')
    medical_history = data.get('medical_history', '')
    doctor_name = data.get('doctor')
    appointment_date = data.get('date')
    # Ensure appointment_date is in DATETIME format (YYYY-MM-DD HH:MM:SS)
    from datetime import datetime
    if appointment_date:
        try:
            # If only date is provided, add time part
            if len(appointment_date) == 10:
                appointment_date += ' 09:00:00'  # default time
            # Try to parse and reformat
            dt = datetime.strptime(appointment_date, '%Y-%m-%d %H:%M:%S')
            appointment_date = dt.strftime('%Y-%m-%d %H:%M:%S')
        except Exception as e:
            return jsonify({'error': f'Invalid date format: {appointment_date}'}), 400
    status = 'booked'
    db = get_db()
    cursor = db.cursor()
    try:
        # Look up user_id by email or name
        user_id = None
        if email:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            user_row = cursor.fetchone()
            if user_row:
                user_id = user_row[0]
        if not user_id and name:
            cursor.execute("SELECT id FROM users WHERE name = %s", (name,))
            user_row = cursor.fetchone()
            if user_row:
                user_id = user_row[0]
        if not user_id:
            return jsonify({'success': False, 'message': 'User not found'}), 400

        # Look up doctor_id by name
        cursor.execute("SELECT id FROM doctors WHERE name = %s", (doctor_name,))
        doctor_row = cursor.fetchone()
        if not doctor_row:
            return jsonify({'success': False, 'message': 'Doctor not found'}), 400
        doctor_id = doctor_row[0]

        # Insert appointment
        cursor.execute(
            "INSERT INTO appointments (user_id, doctor_id, name, email, medical_history, appointment_date) VALUES (%s, %s, %s, %s, %s, %s)",
            (user_id, doctor_id, name, email, medical_history, appointment_date)
        )
        db.commit()
        # Optionally send confirmation email
        # send_confirmation_email(user_id, doctor_id, appointment_date)
        return jsonify({'success': True, 'message': 'Appointment booked'})
    except Exception as e:
        db.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        db.close()

def send_confirmation_email(user_id, doctor_id, appointment_date):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    if user:
        to_email = user[0]
        msg = MIMEText(f"Your appointment with doctor ID {doctor_id} on {appointment_date} is confirmed.")
        msg['Subject'] = "Appointment Confirmation"
        msg['From'] = "noreply@drconsult.com"
        msg['To'] = to_email

        # Update with your SMTP server details
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('your_gmail@gmail.com', 'your_app_password')
            server.send_message(msg)

# Real AI logic using Infermedica API
@app.route('/ai_diagnose', methods=['POST'])
def ai_diagnose():
    data = request.json
    symptoms = data.get('symptoms', '')
    # Infermedica API credentials (replace with your real keys)
    APP_ID = 'abc123yourappid'
    APP_KEY = 'xyz456yourappkey'
    url = 'https://api.infermedica.com/v3/diagnosis'
    headers = {
        'App-Id': APP_ID,
        'App-Key': APP_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    # Use /parse endpoint to get evidence
    parse_url = 'https://api.infermedica.com/v3/parse'
    parse_payload = {
        'text': symptoms,
        'age': {'value': 30}
    }
    try:
        parse_resp = requests.post(parse_url, headers=headers, json=parse_payload, timeout=5)
        evidence = []
        if parse_resp.status_code == 200:
            for mention in parse_resp.json().get('mentions', []):
                evidence.append({
                    'id': mention['id'],
                    'choice_id': mention['choice_id']
                })
        else:
            raise Exception('Failed to parse symptoms')
        payload = {
            'sex': 'male',
            'age': 30,
            'evidence': evidence
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=5)
        if resp.status_code == 200:
            result = resp.json()
            if result['conditions']:
                top = result['conditions'][0]
                prob = top.get('probability', 0)
                triage = top.get('triage_level', 'self-care')
                action = 'see-doctor' if triage in ['emergency', 'consultation'] or prob > 0.5 else 'self-care'
                advice = f"{int(prob*100)}% chance you {'should see a doctor' if action=='see-doctor' else 'do not need to see a doctor, but monitor symptoms.'} (Top: {top['name']})"
                return jsonify({
                    'action': action,
                    'confidence': round(prob, 2),
                    'advice': advice
                })
            else:
                return jsonify({'action': 'self-care', 'confidence': 0.6, 'advice': 'No serious condition detected.'})
        else:
            raise Exception('Diagnosis failed')
    except Exception as e:
        print('Infermedica API error:', e)
        # Fallback: local rules-based model
        action, conf, advice = local_rules_ai(symptoms)
        return jsonify({
            'action': action,
            'confidence': conf,
            'advice': advice
        })

# Simple local rules-based model with confidence
def local_rules_ai(symptoms):
    s = symptoms.lower()
    if any(x in s for x in ['chest pain', 'breath', 'difficulty', 'severe', 'bleeding']):
        return 'see-doctor', 0.95, '95% chance you should see a doctor immediately.'
    elif any(x in s for x in ['fever', 'cough', 'cold', 'headache', 'pain', 'sore']):
        return 'self-care', 0.7, "70% chance you don't need to see a doctor, but monitor symptoms."
    else:
        return 'see-doctor', 0.6, '60% chance you should see a doctor for further evaluation.'

@app.route('/api/prescription_pdf', methods=['POST'])
def prescription_pdf():
    data = request.json
    patient = data.get('patient', 'Patient')
    advice = data.get('advice', 'Take care and rest.')
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="Prescription", ln=True, align='C')
    pdf.ln(10)
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Patient: {patient}", ln=True)
    pdf.multi_cell(0, 10, txt=f"Advice: {advice}")
    pdf.ln(10)
    pdf.cell(200, 10, txt="Doctor: DrAI Consult", ln=True)
    pdf_output = io.BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return send_file(pdf_output, as_attachment=True, download_name='prescription.pdf', mimetype='application/pdf')

@app.route('/api/medical_certificate', methods=['POST'])
def medical_certificate():
    data = request.json
    patient = data.get('patient', 'Patient')
    days = data.get('days', 1)
    reason = data.get('reason', 'Medical condition')
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="Medical Certificate", ln=True, align='C')
    pdf.ln(10)
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Patient: {patient}", ln=True)
    pdf.cell(200, 10, txt=f"Excused for: {days} day(s)", ln=True)
    pdf.multi_cell(0, 10, txt=f"Reason: {reason}")
    pdf.ln(10)
    pdf.cell(200, 10, txt="Doctor: DrAI Consult", ln=True)
    pdf_output = io.BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return send_file(pdf_output, as_attachment=True, download_name='medical_certificate.pdf', mimetype='application/pdf')

# Patient dashboard data
@app.route('/api/patient_dashboard', methods=['GET'])
@jwt_required()
def patient_dashboard():
    user = get_jwt_identity()
    user_id = user['user_id']
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""SELECT COUNT(*) AS appointments FROM appointments WHERE user_id=%s""", (user_id,))
    appointments = cursor.fetchone()['appointments']
    cursor.execute("""SELECT COUNT(*) AS prescriptions FROM medical_records WHERE user_id=%s AND prescription IS NOT NULL""", (user_id,))
    prescriptions = cursor.fetchone()['prescriptions']
    cursor.execute("""SELECT * FROM medical_records WHERE user_id=%s ORDER BY id DESC LIMIT 5""", (user_id,))
    history = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify({'appointments': appointments, 'prescriptions': prescriptions, 'history': history})

# Doctor dashboard data
@app.route('/api/doctor_dashboard', methods=['GET'])
@jwt_required()
def doctor_dashboard():
    user = get_jwt_identity()
    doctor_id = user['user_id']
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""SELECT COUNT(DISTINCT user_id) AS patients_seen FROM appointments WHERE doctor_id=%s""", (doctor_id,))
    patients_seen = cursor.fetchone()['patients_seen']
    cursor.execute("""SELECT COUNT(*) AS pending_appointments FROM appointments WHERE doctor_id=%s AND status='booked'""", (doctor_id,))
    pending_appointments = cursor.fetchone()['pending_appointments']
    cursor.execute("""SELECT * FROM appointments WHERE doctor_id=%s ORDER BY appointment_date DESC LIMIT 5""", (doctor_id,))
    appointments = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify({'patients_seen': patients_seen, 'pending_appointments': pending_appointments, 'appointments': appointments})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
