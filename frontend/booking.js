// Handles doctor booking and Google Maps integration
import { bookAppointment } from './api.js';

export function showBookingForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Book a Doctor</h2>
        <form id="bookingForm">
            <input type="text" name="doctor_id" placeholder="Doctor ID" required><br>
            <input type="datetime-local" name="appointment_date" required><br>
            <button type="submit">Book</button>
        </form>
        <div id="map" style="height:300px;"></div>
        <div id="bookingMsg"></div>
    `;
    // Google Maps API integration (simple placeholder)
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = '<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=doctor" allowfullscreen></iframe>';
    document.getElementById('bookingForm').onsubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const form = e.target;
        const data = {
            user_id: user.id,
            child_id: null,
            doctor_id: form.doctor_id.value,
            appointment_date: form.appointment_date.value
        };
        const res = await bookAppointment(data);
        document.getElementById('bookingMsg').innerText = res.message || res.error;
    };
}
