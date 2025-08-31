from flask import Blueprint, request, jsonify
from datetime import datetime
from db import get_db

payments_demo_api = Blueprint('payments_demo_api', __name__)

@payments_demo_api.route('/api/demo_payment/ai', methods=['POST'])
def record_ai_payment():
    data = request.json
    user_id = data.get('user_id')
    email = data.get('email')
    symptoms = data.get('symptoms', '')
    amount = 100.00
    status = 'PAID'
    payment_method = data.get('payment_method', 'Demo')
    transaction_ref = data.get('transaction_ref', f'DEMO-AI-{datetime.now().strftime("%Y%m%d%H%M%S")}')
    db = get_db()
    cursor = db.cursor()
    try:
        # If user_id not provided, look up by email
        if not user_id and email:
            cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
            row = cursor.fetchone()
            if row:
                user_id = row[0]
            else:
                return jsonify({'error': f'No user found with email: {email}'}), 400
        if not user_id:
            if not email:
                return jsonify({'error': 'Missing user_id and email'}), 400
            return jsonify({'error': 'Missing user_id'}), 400
        cursor.execute("""
            INSERT INTO ai_consultation_payments (user_id, symptoms, amount, status, payment_method, transaction_ref)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_id, symptoms, amount, status, payment_method, transaction_ref))
        db.commit()
        return jsonify({'message': 'AI consultation payment recorded', 'transaction_ref': transaction_ref}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()

@payments_demo_api.route('/api/demo_payment/doctor', methods=['POST'])
def record_doctor_payment():
    data = request.json
    user_id = data.get('user_id')
    appointment_id = data.get('appointment_id')
    email = data.get('email')
    amount = 500.00
    status = 'PAID'
    payment_method = data.get('payment_method', 'Demo')
    transaction_ref = data.get('transaction_ref', f'DEMO-DR-{datetime.now().strftime("%Y%m%d%H%M%S")}')
    db = get_db()
    cursor = db.cursor()
    try:
        # If user_id not provided, look up by email
        if not user_id and email:
            cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
            row = cursor.fetchone()
            if row:
                user_id = row[0]
            else:
                print(f'[DEBUG] No user found with email: {email}')
                return jsonify({'error': f'No user found with email: {email}'}), 400
        if not user_id:
            if not email:
                print('[DEBUG] Missing user_id and email')
                return jsonify({'error': 'Missing user_id and email'}), 400
            print('[DEBUG] Missing user_id')
            return jsonify({'error': 'Missing user_id'}), 400
        # For demo, allow payment without appointment_id
        cursor.execute("""
            INSERT INTO payments (user_id, appointment_id, amount, status, payment_method, transaction_ref)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_id, appointment_id, amount, status, payment_method, transaction_ref))
        db.commit()
        return jsonify({'message': 'Doctor appointment payment recorded', 'transaction_ref': transaction_ref}), 201
    except Exception as e:
        db.rollback()
        print(f'[DEBUG] Exception: {e}')
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()
