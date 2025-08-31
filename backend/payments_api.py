from flask import Blueprint, request, jsonify
from datetime import datetime
from .app import get_db

payments_api = Blueprint('payments_api', __name__)

@payments_api.route('/api/payments', methods=['POST'])
def create_payment():
    data = request.json
    user_id = data.get('user_id')
    appointment_id = data.get('appointment_id')
    amount = data.get('amount', 100.00)
    status = data.get('status', 'PAID')
    payment_method = data.get('payment_method', 'Demo')
    transaction_ref = data.get('transaction_ref', f'DEMO-{datetime.now().strftime("%Y%m%d%H%M%S")}')
    if not user_id or not appointment_id:
        return jsonify({'error': 'Missing user_id or appointment_id'}), 400
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO payments (user_id, appointment_id, amount, status, payment_method, transaction_ref)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_id, appointment_id, amount, status, payment_method, transaction_ref))
        db.commit()
        return jsonify({'message': 'Payment recorded', 'transaction_ref': transaction_ref}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()
