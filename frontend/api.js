// Fetch all doctors from backend
export async function fetchDoctors() {
    const res = await fetch(`${API_BASE}/doctors`);
    return res.json();
}
// Handles all API calls to the backend
const API_BASE = 'http://localhost:5000';

export async function registerUser(userData) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return res.json();
}

export async function loginUser(credentials) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return res.json();
}

export async function addMedicalRecord(record) {
    const res = await fetch(`${API_BASE}/medical_record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    });
    return res.json();
}

export async function bookAppointment(data) {
    const res = await fetch(`${API_BASE}/book_appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function aiDiagnose(symptoms) {
    const res = await fetch(`${API_BASE}/ai_diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
    });
    return res.json();
}
