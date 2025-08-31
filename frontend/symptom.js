// Handles symptom input and AI logic
import { aiDiagnose, addMedicalRecord } from './api.js';

export function showSymptomForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Describe Your Symptoms</h2>
        <form id="symptomForm">
            <textarea name="symptoms" placeholder="Enter symptoms..." required></textarea><br>
            <button type="submit">Check</button>
        </form>
        <div id="aiResult"></div>
    `;
    document.getElementById('symptomForm').onsubmit = async (e) => {
        e.preventDefault();
        const symptoms = e.target.symptoms.value;
        const ai = await aiDiagnose(symptoms);
        let msg = '';
        if (ai.need_doctor) {
            msg = `<b>Recommendation:</b> ${ai.reason} <br><button id='bookBtn'>Book Doctor</button>`;
        } else {
            msg = `<b>Self Service:</b> ${ai.prescription} <br><button id='pdfBtn'>Download Prescription</button>`;
        }
        document.getElementById('aiResult').innerHTML = msg;
        // Save record
        const user = JSON.parse(localStorage.getItem('user'));
        await addMedicalRecord({ user_id: user.id, child_id: null, symptoms, diagnosis: ai.reason || '', prescription: ai.prescription || '' });
        if (ai.need_doctor) {
            document.getElementById('bookBtn').onclick = () => window.dispatchEvent(new Event('showBooking'));
        } else {
            document.getElementById('pdfBtn').onclick = () => window.dispatchEvent(new Event('downloadPrescription'));
        }
    };
}
