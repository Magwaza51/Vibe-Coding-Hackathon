from flask import Flask, request, send_file, jsonify
from fpdf import FPDF
import io
import datetime

app = Flask(__name__)

@app.route('/api/medical_certificate', methods=['POST'])
def generate_medical_certificate():
    data = request.json
    patient = data.get('patient')
    doctor = data.get('doctor')
    date = data.get('date')
    days_off = data.get('days_off')
    reason = data.get('reason', 'Medical illness')
    if not (patient and doctor and date and days_off):
        return jsonify({'error': 'Missing required fields'}), 400

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Medical Certificate', ln=True, align='C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'This is to certify that:', ln=True)
    pdf.cell(0, 10, f'Patient: {patient}', ln=True)
    pdf.cell(0, 10, f'was seen by Dr. {doctor} on {date}.', ln=True)
    pdf.cell(0, 10, f'Reason: {reason}', ln=True)
    pdf.cell(0, 10, f'The patient is unfit for work/school for {days_off} day(s).', ln=True)
    pdf.ln(10)
    pdf.cell(0, 10, f'Date Issued: {datetime.date.today()}', ln=True)
    pdf.ln(20)
    pdf.cell(0, 10, f'Doctor: {doctor}', ln=True)
    pdf.output('medical_certificate.pdf')
    pdf_bytes = io.BytesIO()
    pdf.output(pdf_bytes)
    pdf_bytes.seek(0)
    return send_file(pdf_bytes, as_attachment=True, download_name='medical_certificate.pdf', mimetype='application/pdf')

if __name__ == '__main__':
    app.run(debug=True)
