// Main JS entry point

import { showAuthForms } from './auth.js';
import { showSymptomForm } from './symptom.js';
import { showBookingForm } from './booking.js';
import { downloadPrescription } from './pdf.js';
import { showDoctorDirectory } from './doctors.js';
import { showChatbot } from './chatbot.js';


function showMenu() {
	showSymptomForm(); // Default to symptom checker
	// Navbar event listeners
	const navDoctors = document.getElementById('navDoctors');
	const navChatbot = document.getElementById('navChatbot');
	const navLogout = document.getElementById('navLogout');
	if (navDoctors) navDoctors.onclick = (e) => { e.preventDefault(); showDoctorDirectory(); };
	if (navChatbot) navChatbot.onclick = (e) => { e.preventDefault(); showChatbot(); };
	if (navLogout) navLogout.onclick = (e) => { e.preventDefault(); localStorage.removeItem('user'); window.location.reload(); };
}

window.addEventListener('DOMContentLoaded', () => {
	const user = localStorage.getItem('user');
	if (!user) {
		showAuthForms();
	} else {
		showMenu();
	}
});

window.addEventListener('showBooking', showBookingForm);
window.addEventListener('downloadPrescription', downloadPrescription);
