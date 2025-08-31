
import { fetchDoctors, bookAppointment } from './api.js';
import { notify } from './notify.js';

export async function showDoctorDirectory() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h2 class="mb-4">Find a Doctor</h2>
    <input type="text" class="form-control mb-3" id="doctorSearch" placeholder="Search by name, specialty, or location...">
    <div class="row" id="doctorCards"></div>
    <div class="mt-4" id="mapContainer">
      <iframe width="100%" height="300" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=doctor" allowfullscreen></iframe>
    </div>

    <!-- Doctor Profile Modal -->
    <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="profileModalLabel">Doctor Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="profileModalBody">
            <!-- Profile content will be injected here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookingModalLabel">Book Appointment</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="bookingForm">
              <input type="hidden" id="modalDoctorId">
              <div class="mb-3">
                <label for="appointmentDate" class="form-label">Appointment Date & Time</label>
                <input type="datetime-local" class="form-control" id="appointmentDate" required>
              </div>
              <button type="submit" class="btn btn-primary">Book</button>
            </form>
            <div id="bookingMsg" class="mt-2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Calendar Placeholder -->
    <div class="mt-5">
      <h4>Appointment Calendar (Coming Soon)</h4>
      <div class="bg-light p-4 rounded text-center text-muted">Your upcoming appointments will appear here.</div>
    </div>
  `;
  const doctors = await fetchDoctors();
  renderDoctors(doctors);
  document.getElementById('doctorSearch').oninput = (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = doctors.filter(d =>
      d.name.toLowerCase().includes(val) ||
      d.specialty.toLowerCase().includes(val) ||
      d.location.toLowerCase().includes(val)
    );
    renderDoctors(filtered);
  };

  // Modal booking logic
  setTimeout(() => {
    document.querySelectorAll('.book-btn').forEach(btn => {
      btn.onclick = (e) => {
        const doctorId = e.target.getAttribute('data-id');
        document.getElementById('modalDoctorId').value = doctorId;
        document.getElementById('bookingMsg').innerText = '';
        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
      };
    });
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const doctor_id = document.getElementById('modalDoctorId').value;
        const appointment_date = document.getElementById('appointmentDate').value;
        const res = await bookAppointment({ user_id: user.id, child_id: null, doctor_id, appointment_date });
        document.getElementById('bookingMsg').innerText = res.message || res.error;
        if (res.message) {
          notify('Appointment booked successfully!', 'success');
        } else if (res.error) {
          notify('Booking failed: ' + res.error, 'danger');
        }
      };
    }
  }, 500);
}

function renderDoctors(doctors) {
  const cards = doctors.map(d => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${d.image}" class="card-img-top" alt="${d.name}">
        <div class="card-body">
          <h5 class="card-title">${d.name}</h5>
          <p class="card-text mb-1"><b>Specialty:</b> ${d.specialty}</p>
          <p class="card-text"><b>Location:</b> ${d.location}</p>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-outline-info flex-fill profile-btn" data-id="${d.id}">View Profile</button>
            <button class="btn btn-primary flex-fill book-btn" data-id="${d.id}">Book Appointment</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  document.getElementById('doctorCards').innerHTML = cards || '<p>No doctors found.</p>';

  // Profile modal logic
  document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.onclick = (e) => {
      const doctorId = e.target.getAttribute('data-id');
      const doc = doctors.find(d => d.id == doctorId);
      document.getElementById('profileModalBody').innerHTML = `
        <div class="text-center">
          <img src="${doc.image}" class="rounded-circle mb-3" width="100" height="100" alt="${doc.name}">
          <h5>${doc.name}</h5>
          <p><b>Specialty:</b> ${doc.specialty}</p>
          <p><b>Location:</b> ${doc.location}</p>
          <p><i>More info coming soon...</i></p>
        </div>
      `;
      const modal = new bootstrap.Modal(document.getElementById('profileModal'));
      modal.show();
    };
  });
}
