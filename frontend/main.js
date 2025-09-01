// Backend API URL
const API_URL = "https://vibe-coding-hackathon-2.onrender.com";
// Language selector (demo translations)
const langMap = {
  en: {
    'Healthcare AI at Your Fingertips': 'Healthcare AI at Your Fingertips',
    'Book appointments, check symptoms, and manage your health securely with AI-powered assistance.': 'Book appointments, check symptoms, and manage your health securely with AI-powered assistance.',
    'Get Started': 'Get Started',
    'Try Symptom Checker': 'Try Symptom Checker',
    'AI Symptom Checker': 'AI Symptom Checker',
    'Book a Doctor': 'Book a Doctor',
    'Health Records': 'Health Records',
    'How It Works': 'How It Works',
    'Sign Up or Log In': 'Sign Up or Log In',
    'Book or Chat': 'Book or Chat',
    'Get Care': 'Get Care',
    'Meet Our Doctors': 'Meet Our Doctors',
    'Medical Records': 'Medical Records',
    'Your Dashboard': 'Your Dashboard',
    'Register': 'Register',
    'Login': 'Login',
  },
    zu: {
    'Healthcare AI at Your Fingertips': 'I-AI Yezempilo Ezandleni Zakho',
    'Book appointments, check symptoms, and manage your health securely with AI-powered assistance.': 'Bhuka izikhathi, hlola izimpawu, futhi uphathe impilo yakho ngokuphepha nge-AI.',
    'Get Started': 'Qala',
    'Try Symptom Checker': 'Hlola Izimpawu',
    'AI Symptom Checker': 'Hlola Izimpawu nge-AI',
    'Book a Doctor': 'Bhuka Udokotela',
    'Health Records': 'Amarekhodi Ezempilo',
    'How It Works': 'Kusebenza Kanjani',
    'Sign Up or Log In': 'Bhalisa noma Ngena',
    'Book or Chat': 'Bhuka noma Xoxa',
    'Get Care': 'Thola Usizo',
    'Meet Our Doctors': 'Hlangana Nodokotela Bethu',
    'Medical Records': 'Amarekhodi Ezempilo',
    'Your Dashboard': 'Ideshibhodi Yakho',
    'Register': 'Bhalisa',
    'Login': 'Ngena',
},
af: {
    'Healthcare AI at Your Fingertips': 'Gesondheids-AI Binne Jou Bereik',
    'Book appointments, check symptoms, and manage your health securely with AI-powered assistance.': 'Maak afsprake, kyk simptome, en bestuur jou gesondheid veilig met KI.',
    'Get Started': 'Begin Nou',
    'Try Symptom Checker': 'Probeer Simptoomkontrole',
    'AI Symptom Checker': 'KI Simptoomkontrole',
    'Book a Doctor': 'Boek n Dokter',
    'Health Records': 'Gesondheidsrekords',
    'How It Works': 'Hoe Dit Werk',
    'Sign Up or Log In': 'Registreer of Meld Aan',
    'Book or Chat': 'Boek of Gesels',
    'Get Care': 'Kry Sorg',
    'Meet Our Doctors': 'Ontmoet Ons Dokters',
    'Medical Records': 'Gesondheidsrekords',
    'Your Dashboard': 'Jou Dashboard',
    'Register': 'Registreer',
    'Login': 'Meld Aan',
  }
};

// Pay Now button logic (demo modal)
document.addEventListener('DOMContentLoaded', function() {
  // Modal utility (move to top so it's available for all handlers)
  function showModal(title, message) {
    let modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="custom-modal-content">
        <h5>${title}</h5>
        <p>${message}</p>
        <button class="btn btn-primary mt-2" id="closeModalBtn">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModalBtn').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  // Disable AI Symptom Checker form until payment is made
  const symptomForm = document.getElementById('symptomForm');
  const checkSymptomsBtn = symptomForm ? symptomForm.querySelector('button[type="submit"]') : null;
  if (symptomForm && checkSymptomsBtn) {
    symptomForm.classList.add('disabled');
    checkSymptomsBtn.disabled = true;
    checkSymptomsBtn.textContent = 'Pay to Check Symptoms';
    // Prevent submit if disabled
    symptomForm.addEventListener('submit', function(e) {
      if (symptomForm.classList.contains('disabled')) {
        e.preventDefault();
        return false;
      }
    }, true);
  }
  const payNowBtn = document.getElementById('payNowBtn');
  const payLaterBtn = document.getElementById('payLaterBtn');
  if (payNowBtn) {
    payNowBtn.addEventListener('click', function() {
      showModal('Payment', `
        <div class="text-center">
          <h5 class="mb-3">Consultation Fee: <span class="text-primary">R500</span></h5>
          <p class="mb-2">Pay securely online to confirm your booking.</p>
          <ul class="list-unstyled mb-2">
            <li>• Credit Card</li>
            <li>• Debit Card</li>
            <li>• EFT</li>
            <li>• Mobile Money</li>
          </ul>
          <p class="mb-2">Powered by <b>PayFast</b>, <b>PayPal</b>, or <b>Stripe</b> (integration ready).</p>
          <span class="text-success small">You only pay when booking a consultation.</span>
          <br>
          <span class="text-danger small"><b>Note:</b> This is a demo system. No real payments will be processed.</span>
          <br><br>
          <button class="btn btn-success" id="proceedDoctorPaymentBtn">Proceed to Payment (Demo)</button>
        </div>
      `);
      setTimeout(() => {
        const proceedBtn = document.getElementById('proceedDoctorPaymentBtn');
        if (proceedBtn) {
          proceedBtn.addEventListener('click', async function() {
            proceedBtn.disabled = true;
            proceedBtn.textContent = 'Processing...';
            // For demo, ask for email (or use a prompt)
            let email = prompt('Enter your email for payment record:');
            if (!email) {
              proceedBtn.disabled = false;
              proceedBtn.textContent = 'Proceed to Payment (Demo)';
              return;
            }
            try {
              const res = await fetch(`${API_URL}/api/demo_payment/doctor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              const data = await res.json();
              if (res.ok && (data.success || data.message)) {
                proceedBtn.textContent = 'Payment Successful!';
                proceedBtn.classList.remove('btn-success');
                proceedBtn.classList.add('btn-secondary');
                setTimeout(() => document.querySelector('.custom-modal')?.remove(), 1500);
              } else {
                proceedBtn.textContent = 'Payment Failed';
                proceedBtn.classList.remove('btn-success');
                proceedBtn.classList.add('btn-danger');
              }
            } catch {
              proceedBtn.textContent = 'Server Error';
              proceedBtn.classList.remove('btn-success');
              proceedBtn.classList.add('btn-danger');
            }
          });
        }
      }, 100);
    });
  }

  if (payLaterBtn) {
    payLaterBtn.addEventListener('click', function() {
      showModal('Pay Later', 'You have chosen to pay later. Your appointment will be booked, but payment will be required before your consultation.');
    });
  }
  const payAiBtn = document.getElementById('payAiBtn');
  console.log('[DEBUG] payAiBtn:', payAiBtn);
  if (payAiBtn) {
    console.log('[DEBUG] Attaching click handler to payAiBtn');
    payAiBtn.addEventListener('click', function() {
      console.log('[DEBUG] payAiBtn clicked');
      showModal('Payment', `
        <div class="text-center">
          <h5 class="mb-3">AI Consultation Fee: <span class="text-primary">R100</span></h5>
          <p class="mb-2">Pay securely online to access the AI Symptom Checker.</p>
          <ul class="list-unstyled mb-2">
            <li>• Credit Card</li>
            <li>• Debit Card</li>
            <li>• EFT</li>
            <li>• Mobile Money</li>
          </ul>
          <p class="mb-2">Powered by <b>PayFast</b>, <b>PayPal</b>, or <b>Stripe</b> (integration ready).</p>
          <span class="text-success small">You only pay for each AI consultation.</span>
          <br>
          <span class="text-danger small"><b>Note:</b> This is a demo system. No real payments will be processed.</span>
          <br><br>
          <button class="btn btn-success" id="proceedAiPaymentBtn">Proceed to Payment (Demo)</button>
        </div>
      `);
      setTimeout(() => {
        const proceedBtn = document.getElementById('proceedAiPaymentBtn');
        if (proceedBtn) {
          proceedBtn.addEventListener('click', async function() {
            proceedBtn.disabled = true;
            proceedBtn.textContent = 'Processing...';
            let email = prompt('Enter your email for payment record:');
            if (!email) {
              proceedBtn.disabled = false;
              proceedBtn.textContent = 'Proceed to Payment (Demo)';
              return;
            }
            try {
              const res = await fetch(`${API_URL}/api/demo_payment/ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              const data = await res.json();
              if (res.ok && (data.success || data.message)) {
                proceedBtn.textContent = 'Payment Successful!';
                proceedBtn.classList.remove('btn-success');
                proceedBtn.classList.add('btn-secondary');
                // Enable AI Symptom Checker form after payment
                if (symptomForm && checkSymptomsBtn) {
                  symptomForm.classList.remove('disabled');
                  checkSymptomsBtn.disabled = false;
                  checkSymptomsBtn.textContent = 'Check Symptoms';
                }
                // Remove the AI payment button after payment
                if (payAiBtn) {
                  payAiBtn.style.display = 'none';
                }
                setTimeout(() => document.querySelector('.custom-modal')?.remove(), 1500);
              } else {
                proceedBtn.textContent = 'Payment Failed';
                proceedBtn.classList.remove('btn-success');
                proceedBtn.classList.add('btn-danger');
              }
            } catch {
              proceedBtn.textContent = 'Server Error';
              proceedBtn.classList.remove('btn-success');
              proceedBtn.classList.add('btn-danger');
            }
          });
        }
      }, 100);
    });
  }
});

// Call Emergency button logic
const callEmergencyBtn = document.getElementById('callEmergencyBtn');
if (callEmergencyBtn) {
  callEmergencyBtn.addEventListener('click', function() {
    window.location.href = 'tel:112';
  });
}
const langSelect = document.getElementById('langSelect');
if (langSelect) {
  langSelect.addEventListener('change', function() {
    const lang = this.value;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (langMap[lang][key]) el.textContent = langMap[lang][key];
    });
  });
}

// Chatbot widget logic
const chatbotWidget = document.getElementById('chatbotWidget');
const chatbotOpen = document.getElementById('chatbotOpen');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
function addChatMsg(msg, sender='bot') {
  const div = document.createElement('div');
  div.className = 'chatbot-msg ' + sender;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = msg;
  div.appendChild(bubble);
  chatbotBody.appendChild(div);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}
if (chatbotOpen && chatbotWidget) {
  chatbotOpen.onclick = () => { chatbotWidget.style.display = 'flex'; chatbotOpen.style.display = 'none'; };
}
if (chatbotClose && chatbotWidget) {
  chatbotClose.onclick = () => { chatbotWidget.style.display = 'none'; chatbotOpen.style.display = 'flex'; };
}
if (chatbotForm) {
  chatbotForm.onsubmit = async function(e) {
    e.preventDefault();
    const userMsg = chatbotInput.value.trim();
    if (!userMsg) return;
    addChatMsg(userMsg, 'user');
    chatbotInput.value = '';
    // Call AI endpoint
    addChatMsg('Thinking...', 'bot');
    try {
      const res = await fetch('/ai_diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: userMsg })
      });
      const data = await res.json();
      chatbotBody.lastChild.remove(); // remove 'Thinking...'
      if (data.advice) {
        addChatMsg(data.advice, 'bot');
      } else if (data.reason) {
        addChatMsg(data.reason, 'bot');
      } else {
        addChatMsg('Sorry, I could not understand. Please try again.', 'bot');
      }
    } catch {
      chatbotBody.lastChild.remove();
      addChatMsg('Sorry, there was a problem connecting to the AI.', 'bot');
    }
  };
}
const healthTips = document.getElementById('healthTips');
const tipsList = document.getElementById('tipsList');
// Directions and Teleconsultation
let directionsService, directionsRenderer;
function initDirections(mapInstance) {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(mapInstance);
}
function showRouteToDoctor(userPos, docPos) {
  if (!directionsService || !directionsRenderer) return;
  directionsService.route({
    origin: userPos,
    destination: docPos,
    travelMode: 'DRIVING'
  }, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
    } else {
      showModal('Directions Error', 'Could not get directions.');
    }
  });
}
// Attach to doctor cards
document.querySelectorAll('.doctor-card .directions-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const card = e.target.closest('.doctor-card');
    const docLat = parseFloat(card.getAttribute('data-lat'));
    const docLng = parseFloat(card.getAttribute('data-lng'));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        showModal('Directions', 'Route will be shown on the map below.');
        if (window.map) {
          initDirections(window.map);
          showRouteToDoctor(userPos, { lat: docLat, lng: docLng });
        }
      }, function() {
        showModal('Location Error', 'Could not get your location.');
      });
    } else {
      showModal('Location Error', 'Geolocation not supported.');
    }
  });
});
// Teleconsultation button
document.querySelectorAll('.doctor-card .tele-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const card = e.target.closest('.doctor-card');
    const docName = card.getAttribute('data-name');
    showModal('Teleconsultation', `Starting teleconsultation with ${docName}. (Demo: This would open a video call link.)`);
  });
});
// Google Maps Integration (Doctors section)
let map, userMarker, doctorMarkers = [];
// Doctor directory data (update AI Assistant name)
const doctors = [
{
  name: 'Dr. John Smith',
  type: 'General',
  lat: -26.2041,
  lng: 28.0473,
  image: 'https://randomuser.me/api/portraits/men/30.jpg'
},
{
  name: 'Dr. Lindiwe Moyo',
  type: 'Pediatrician',
  lat: -26.2022,
  lng: 28.0456,
  image: 'https://randomuser.me/api/portraits/women/40.jpg'
},
{
  name: 'AI DR Chat',
  type: 'AI',
  lat: -26.2035,
  lng: 28.0490,
  image: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png' // AI avatar
}
];
function initMap(center) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 14
  });
  userMarker = new google.maps.Marker({
    position: center,
    map: map,
    title: 'You are here',
    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });
  addDoctorMarkers();
}
function addDoctorMarkers(filterType) {
  doctorMarkers.forEach(m => m.setMap(null));
  doctorMarkers = [];
  doctors.forEach(doc => {
    if (!filterType || doc.type === filterType) {
      const marker = new google.maps.Marker({
        position: { lat: doc.lat, lng: doc.lng },
        map: map,
        title: doc.name
      });
      const infowindow = new google.maps.InfoWindow({ content: `<b>${doc.name}</b><br>${doc.type}` });
      marker.addListener('click', () => infowindow.open(map, marker));
      doctorMarkers.push(marker);
    }
  });
}
const findNearbyBtn = document.getElementById('findNearbyBtn');
const conditionType = document.getElementById('conditionType');
if (findNearbyBtn && document.getElementById('map')) {
  findNearbyBtn.addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        initMap(center);
      }, function() {
        showModal('Location Error', 'Could not get your location. Showing default area.');
        initMap({ lat: -26.2041, lng: 28.0473 });
      });
    } else {
      showModal('Location Error', 'Geolocation not supported. Showing default area.');
      initMap({ lat: -26.2041, lng: 28.0473 });
    }
  });
  // Default map on load
  initMap({ lat: -26.2041, lng: 28.0473 });
}
if (conditionType) {
  conditionType.addEventListener('change', function() {
    const type = this.value;
    addDoctorMarkers(type);
  });
}
// main.js - Adds interactivity to the homepage

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Show/hide Register, Login, and Logout buttons based on login state
  const registerBtn = document.querySelector('a[href="register.html"]');
  const loginBtn = document.querySelector('a[href="login.html"]');
  const logoutBtn = document.getElementById('logoutBtn');

  function updateAuthButtons() {
    const isLoggedIn = !!localStorage.getItem('access_token');
    if (logoutBtn) logoutBtn.classList.toggle('d-none', !isLoggedIn);
    if (registerBtn) registerBtn.classList.toggle('d-none', isLoggedIn);
    if (loginBtn) loginBtn.classList.toggle('d-none', isLoggedIn);
  }
  updateAuthButtons();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Remove token and update UI
      localStorage.removeItem('access_token');
      updateAuthButtons();
      // Optionally, show a message or redirect
      if (typeof showModal === 'function') {
        showModal('Logged Out', 'You have been logged out successfully.');
      } else {
        alert('You have been logged out.');
      }
      // Optionally, redirect to home or login
      // window.location.href = 'login.html';
    });
  }

  // Feature card hover effect
  document.querySelectorAll('.feature-min-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('active'));
    card.addEventListener('mouseleave', () => card.classList.remove('active'));
  });

  // Doctor card click highlight
  document.querySelectorAll('.doctor-min-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
    });
  });

  // Step number animation
  document.querySelectorAll('.step-min-num').forEach((el, i) => {
    setTimeout(() => el.classList.add('step-animate'), 300 + i * 200);
  });

  // Tooltip for icons
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function() {
      let tip = document.createElement('div');
      tip.className = 'custom-tooltip';
      tip.innerText = el.getAttribute('data-tooltip');
      document.body.appendChild(tip);
      const rect = el.getBoundingClientRect();
      tip.style.left = rect.left + window.scrollX + 'px';
      tip.style.top = (rect.top + window.scrollY - 32) + 'px';
      el._tip = tip;
    });
    el.addEventListener('mouseleave', function() {
      if (el._tip) el._tip.remove();
    });
  });

  // Modal utility
  function showModal(title, message) {
    let modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="custom-modal-content">
        <h5>${title}</h5>
        <p>${message}</p>
        <button class="btn btn-primary mt-2" id="closeModalBtn">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModalBtn').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  // Symptom Checker Demo
  const symptomForm = document.getElementById('symptomForm');
  const symptomResult = document.getElementById('symptomResult');
  const downloadPrescription = document.getElementById('downloadPrescription');
  const bookConsultBtn = document.getElementById('bookConsultBtn');
  const selfCareSteps = document.getElementById('selfCareSteps');
  if (symptomForm) {
    symptomForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const symptoms = document.getElementById('symptoms').value.trim();
      if (!symptoms) return;
      // Demo AI logic
      let advice, type, daysOff = 0;
      if (/fever|cough|cold|headache|pain|sore/i.test(symptoms)) {
        advice = 'You may have a mild illness. Please rest, stay hydrated, and monitor your symptoms.';
        type = 'self';
        daysOff = 2;
      } else if (/chest pain|breath|difficulty|severe|bleeding/i.test(symptoms)) {
        advice = 'Your symptoms may be serious. Please visit the Emergency Room immediately!';
        type = 'emergency';
        daysOff = 0;
      } else if (/sick note|booked off|off work|off school|medical certificate/i.test(symptoms)) {
  advice = 'You have been booked off work/school. Please download your medical certificate.';
  type = 'bookedoff';
  daysOff = 3;
      } else {
        advice = 'We recommend booking a doctor for further consultation.';
        type = 'doctor';
        daysOff = 0;
      }
      symptomResult.className = 'alert mt-3 ' + (type === 'emergency' ? 'alert-danger' : type === 'self' ? 'alert-success' : type === 'doctor' ? 'alert-warning' : 'alert-info');
      symptomResult.textContent = advice;
      symptomResult.classList.remove('d-none');
      if (downloadPrescription) downloadPrescription.classList.toggle('d-none', type !== 'self');
      if (bookConsultBtn) bookConsultBtn.classList.toggle('d-none', type !== 'doctor');
      if (selfCareSteps) selfCareSteps.classList.toggle('d-none', type !== 'self');
      const downloadMedCert = document.getElementById('downloadMedCert');
      if (downloadMedCert) downloadMedCert.classList.toggle('d-none', type !== 'bookedoff');
      // Always update downloadMedCert button for bookedoff
      if (downloadMedCert) {
        if (type === 'bookedoff') {
          downloadMedCert.classList.remove('d-none');
          downloadMedCert.disabled = false;
          // Store dynamic info for download
          downloadMedCert.dataset.daysOff = daysOff;
          downloadMedCert.dataset.reason = advice;
        } else {
          downloadMedCert.classList.add('d-none');
        }
      }
      // Health tips logic
      if (healthTips && tipsList) {
        tipsList.innerHTML = '';
        let tips = [];
        if (/fever|temperature/i.test(symptoms)) {
          tips.push('Keep cool with light clothing and tepid sponging.');
          tips.push('Avoid caffeine and alcohol.');
        }
        if (/cough|sore throat/i.test(symptoms)) {
          tips.push('Use honey and warm fluids to soothe your throat.');
          tips.push('Avoid irritants like smoke and strong odors.');
        }
        if (/headache|migraine/i.test(symptoms)) {
          tips.push('Rest in a quiet, dark room.');
          tips.push('Stay hydrated and avoid skipping meals.');
        }
        if (/pain|body ache/i.test(symptoms)) {
          tips.push('Gentle stretching and rest can help.');
        }
        if (tips.length === 0) {
          tips.push('Eat a balanced diet rich in fruits and vegetables.');
          tips.push('Get regular exercise and enough sleep.');
        }
        tips.forEach(tip => {
          const li = document.createElement('li');
          li.textContent = tip;
          tipsList.appendChild(li);
        });
        healthTips.classList.remove('d-none');
      }
      // Hide all for emergency
      if (type === 'emergency') {
        if (downloadPrescription) downloadPrescription.classList.add('d-none');
        if (bookConsultBtn) bookConsultBtn.classList.add('d-none');
        if (selfCareSteps) selfCareSteps.classList.add('d-none');
        if (healthTips) healthTips.classList.add('d-none');
      }
    });
    if (downloadPrescription) {
      downloadPrescription.addEventListener('click', function() {
        const patient = prompt('Enter your name for the prescription PDF:');
        const advice = symptomResult.textContent;
  fetch(`${API_URL}/api/prescription_pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, advice })
        })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'prescription.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        });
      });
    }
    const downloadMedCert = document.getElementById('downloadMedCert');
    if (downloadMedCert) {
      downloadMedCert.addEventListener('click', function() {
        const patient = prompt('Enter your name for the medical certificate:');
        const doctor = 'AI Doctor';
        const date = new Date().toISOString().slice(0, 10);
        // Use dynamic daysOff and reason if available
        const days_off = downloadMedCert.dataset.daysOff || 3;
        const reason = downloadMedCert.dataset.reason || 'Booked off work/school by AI Symptom Checker';
  fetch(`${API_URL}/api/medical_certificate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient, doctor, date, days: days_off, reason })
        })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'medical_certificate.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        });
      });
    }
  }

  // Booking Demo
  const bookingForm = document.getElementById('bookingForm');
  const bookingResult = document.getElementById('bookingResult');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('bookName').value.trim();
      const doctor = document.getElementById('bookDoctor').value;
      const date = document.getElementById('bookDate').value;
      // For demo, ask for email (or use a prompt)
      let email = prompt('Enter your email for confirmation:');
      if (!name || !doctor || !date || !email) return;
      bookingResult.classList.remove('alert-success', 'alert-danger');
      bookingResult.classList.add('alert-info');
      bookingResult.textContent = 'Booking appointment...';
      bookingResult.classList.remove('d-none');
      try {
  const res = await fetch(`${API_URL}/book_appointment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, doctor, date, email })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          bookingResult.className = 'alert mt-3 alert-success';
          bookingResult.textContent = data.message;
          updateDashboard(1, 0);
          addRecord(date, doctor, 'Appointment', 'Booked via web app');
        } else {
          bookingResult.className = 'alert mt-3 alert-danger';
          bookingResult.textContent = data.message || 'Booking failed.';
        }
      } catch (err) {
        bookingResult.className = 'alert mt-3 alert-danger';
        bookingResult.textContent = 'Error connecting to server.';
      }
    });
  }

  // Dashboard Demo
  function updateDashboard(appointments, prescriptions) {
    const a = document.querySelector('.dashboard-appointments');
    const p = document.querySelector('.dashboard-prescriptions');
    if (a) a.textContent = appointments;
    if (p) p.textContent = prescriptions;
  }
  // Records Demo
  function addRecord(date, doctor, type, notes) {
    const table = document.getElementById('recordsTable');
    if (table) {
      if (table.children.length === 1 && table.children[0].children[0].classList.contains('text-muted')) {
        table.innerHTML = '';
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${date}</td><td>${doctor}</td><td>${type}</td><td>${notes}</td>`;
      table.appendChild(tr);
    }
  }
  // Dashboard refresh demo
  const refreshBtn = document.getElementById('refreshDashboard');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      showModal('Dashboard Refreshed', 'Demo: Dashboard data would be updated from the backend.');
    });
  }

  async function loadPatientDashboard() {
  const res = await fetch(`${API_URL}/api/patient_dashboard`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }
    });
    const data = await res.json();
    // Update stats
    document.querySelector('.dashboard-appointments').textContent = data.appointments;
    document.querySelector('.dashboard-prescriptions').textContent = data.prescriptions;
    // Show history table or chart
    const ctx = document.getElementById('historyChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.history.map(r => r.diagnosis || 'Record'),
        datasets: [{
          label: 'Prescriptions',
          data: data.history.map(r => r.prescription ? 1 : 0),
          backgroundColor: '#0d6efd'
        }]
      }
    });
  }
});
// Enhance Dr. AI Assistant card interactivity
// Add a special click event for Dr. AI Assistant to open the chatbot directly

document.querySelectorAll('.doctor-card[data-name="AI DR Chat"] .tele-btn').forEach(btn => {
btn.addEventListener('click', function(e) {
  // Open chatbot widget and focus input
  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatbotOpen = document.getElementById('chatbotOpen');
  if (chatbotWidget && chatbotOpen) {
    chatbotWidget.style.display = 'flex';
    chatbotOpen.style.display = 'none';
    // Optionally, focus the input
    const chatbotInput = document.getElementById('chatbotInput');
    if (chatbotInput) chatbotInput.focus();
  }
  // Show a welcome message from Dr. AI Assistant
  if (typeof addChatMsg === 'function') {
    addChatMsg('Hello! I am Dr. AI Assistant. How can I help you today?', 'bot');
  }
});
});
